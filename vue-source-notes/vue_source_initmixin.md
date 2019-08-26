
* mergeOptions(parent, child, vm)

该函数处理vm.$options
先将child中的props, inject, directives全部进行规整化(将不规范的书写变为规整的)
`props[name] = val ? {type: val}`
`inject[name] = {i: {from: inject[i]}}`
`directives[name] = {'blue': {bind: func, update: func}}`

然后使用mergeField函数合并parent和child  
`src\core\util\options.js`这个文件中包含options的合并策略，对于生命周期钩子是直接合并，形成一个数组  
如果`config.optionMergeStrategies`中没有定义对应key的merge方法，则使用一个默认的函数，该函数为  
`(p, c) => { if (c) return c; else return p; }`

可以**自定义**`config.optionMergeStrategies`以达到改变合并策略的目的  
形式为`key: (parent[key], child[key], vm, key) => {...}`

* resolveConstructorOptions(Ctor)

解析构造器中的选项
如果Ctor没有super即没有父类，则直接返回`Ctor.options`
否则Ctor应该有`superOption`, 如果super的options和Ctor中保存的superOption不相同，将Ctor的superOption置为super的options
然后是一个补丁，修正了热重载和vue-loader的问题(#4976)
将superOption和自身的extendOptions合并，组成新的options

* initProxy(vm)

在vm上挂了一个_renderProxy属性，代理了vm的属性，获取/检验属性在vm中时会进行检测并给出警告

### beforeCreate钩子执行之前进行的初始化

* initLifeCycle(vm)

根据vm.$options初始化vm
其中会遍历查找不为abstract的parent元素
初始化

```javascript
vm.$parent = parent
vm.$root = parent ? parent.$root : vm

vm.$children = []
vm.$refs = {}

vm._watcher = null
vm._inactive = null
vm._directInactive = false
vm._isMounted = false
vm._isDestroyed = false
vm._isBeingDestroyed = false
```

* initEvents(vm)

初始化事件

```javascript
vm._events = Object.create(null)
vm._hasHookEvent = false
```
然后通过`vm.$options._parentListeners`绑定parent中的事件, 对于事件a，把它弄成a.fns=a的类型，绑定了函数执行作用域
`vm.$on, vm.$off`分别绑定和解除事件

* initRender(vm)

```javascript
vm._vnode = null // 子树的根vnode，比如组件的根元素是section，则这个vnode的tag就是section
vm._staticTrees = null // v-once cached trees
const parentVnode = vm.$vnode = options._parentVnode // 占位vnode，tag为vue-component-3-Header这种类型的
const renderContext = parentVnode && parentVnode.context
vm.$slots = resolveSlots(options._renderChildren, renderContext) // 解析slot="user"这种东西，options._renderChildren中包含了模板解析到的所有VNode，包含空的Vnode，这一步把空白的Vnode剔除并进行了规整化
vm.$scopedSlots = emptyObject

vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false) // 模板编译过程中调用
vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true) // 用户自定义的render function调用这个

defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true) // 绑定$attrs和$listeners属性，$attrs中包含所有不在props中的父组件传过来的属性，$listeners包含所有父组件上绑定的不为native的事件
defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true) // 子组件中调用this.$listeners.xxx就可以直接调用父组件中的事件，甚至绑定this.$listeners.xxx.bind(this)函数作用域也还是父组件
```

* callHook(vm, hook)

执行this.$options[hook]对应的钩子函数（有可能有多个）。
执行完后，如果`vm._hasHookEvent == true`会`$emit`一个`hook:${hook}`的事件

* initInjections(vm)

在`this.$parent`逐层向上查找每个inject项目的值（使用injectitem.from），如果没有找到则使用default
找到值后使用`defineReactive`函数将vm与值进行绑定

* initState(vm)


