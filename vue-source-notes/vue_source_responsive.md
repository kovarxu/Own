## Observer class

* new Observer(data)
首先`data.__ob__ = this; this.dep = new Dep()`
根据data的类型进行observe操作：如果是Array，先让__proto__指向被劫持的Array方法（8种），然后`this.observeArray(value)`
其他类型直接`this.walk(value)`

* walk(value)

对value中每个键执行`defineReactive(obj, keys[i])`

* observe(val, asRootData)

对非obj，VNode元素，有__ob__属性的值，为Component的值（vm._isVue == true）不会进行什么操作
操作其实就是创建一个Observer实例：`ob = new Observer(value)`
如果作为根元素：`if (asRootData && ob) { ob.vmCount++ }`

* defineReactive(obj, key, val, customSetter, shallow)

val不赋值时如果obj[key]的getter没有或者setter有，`val=obj[key]`
该方法的核心是重写了get和set属性，作为响应式的核心
`let childOb = !shallow && observe(val)` 如果不是浅监听，则也监听值

```javascript
const dep = new Dep()
Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend() // 将watcher绑定dep
        if (childOb) {
          childOb.dep.depend() // 将watcher绑定childOb.dep
          if (Array.isArray(value)) { // 如果value是数组，将此watcher绑定数组中已经被observe的项(有__ob__属性),此操作会递归进行
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      if (newVal === value || (newVal !== newVal && value !== value)) { // 判断NaN
        return
      }
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter() // 这是个在dev环境可执行的钩子
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return // 对有getter而无setter属性的值，直接返回，不能进行赋值
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify() // 通知属性对应的dep，dep分发到各个watcher
    }
  })
}
```

## Dep

Dep是连接Observer和Watcher的桥梁

`this.subs = []`
addSub, removeSub 分别是给subs数组添加watcher

```javascript
depend () { // Dep.target 是一个watcher，这步操作绑定这个watcher和dep
  if (Dep.target) {
    Dep.target.addDep(this)
  }
}
```

update 方法则调用了所有sub的update方法

## Watcher

* new Watcher(vm, expOrFn, cb, options, isRenderWatcher)

```javascript
this.vm = vm  // 将此watcher与vm彼此连接
if (isRenderWatcher) {
  vm._watcher = this // 渲染watcher，在render function中用到
}
vm._watchers.push(this)

...

if (typeof expOrFn === 'function') {
  this.getter = expOrFn // getter决定了此watcher如何获取vm的数据，例如getter是返回a.b.c的函数，则它获取(或者说观察)了vm.a.b.c
} else {
  this.getter = parsePath(expOrFn)
  ...

this.value = this.lazy // 最后求得这个watcher的值，如果有lazy属性则是懒求值
    ? undefined
    : this.get()
```

* Watcher.prototype.get()

先把Dep.target设为自己（这一步至关重要）  
然后求值`value = this.getter.call(vm, vm)`，在对vm的数据进行读取的过程中，执行了 `reactiveGetter` 的get操作（Observer中的），这一步实现了watcher与多个dep的绑定。
`if (this.deep) {traverse(value)}` 这一步遍历value的依赖，实现深观察
最后使用`this.cleanupDeps()`方法清理dep，这个方法将`deps, depIds` 分别用 `newDeps, newDepIds`替代，并清空后者。

* addDep(dep)

在this.newDepIds 与 this.newDeps中加入dep的信息，然后在dep的subs中加入自身，以达到watcher与dep的双向绑定

* traverse(value)

循环收集所有依赖

```javascript
if (val.__ob__) { // 只针对已经被observe的值进行操作
  const depId = val.__ob__.dep.id
  if (seen.has(depId)) {
    return
  }
  seen.add(depId) // 为了避免循环操作，先保存一个Set，存入已经操作过的dep
}

if (isA) {
  i = val.length
  while (i--) _traverse(val[i], seen) // 如果是一个数组，在val[i]的取值过程中在watcher中加入了第i项的依赖，下面对于object同理操作
} else {
  keys = Object.keys(val)
  i = keys.length
  while (i--) _traverse(val[keys[i]], seen)
}
```

* Watcher.prototype.update()

```javascript
update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true // lazy，标记被污染，在之后会被处理
  } else if (this.sync) { // sync立即同步更新执行回调
    this.run()
  } else {
    queueWatcher(this) // 除此之外，加入观察者队列
  }
}

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
run () {
  if (this.active) {
    const value = this.get()
    if ( // 三种情况会执行，1. 新值和原值不等；2. 新值是一个对象；3. deep为true
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      const oldValue = this.value
      this.value = value
      ...
      this.cb.call(this.vm, value, oldValue) // 执行回调
    }
  }
}
```
