### 最开始的阶段：从构建过程找到构建选项

```javascript
// Runtime+compiler CommonJS build (CommonJS)
'web-full-cjs': {
  entry: resolve('web/entry-runtime-with-compiler.js'),
  dest: resolve('dist/vue.common.js'),
  format: 'cjs',
  alias: { he: './entity-decoder' },
  banner
},
...
```

* 构建文件

`Vue.prototype.$mount`的挂载，该函数将`template`转化为了`render`函数，保存到`options.render`中去
调用了`compileToFunctions`核心`compile`函数解析模板，最后执行最初绑定的$mount函数

在`src\platforms\web\runtime\index.js`中有$mount最初的定义，最后执行的是`lifecycle`中的`mountComponent`这个方法

* mountComponent(vm, el, hydrating)

首先执行了`beforeMount`钩子函数
然后创建Vnode并执行update方法：`const vnode = vm._render(); vm._update(vnode, hydrating)`
创建了一个`renderWatcher`:

```javascript
new Watcher(vm, updateComponent, noop, {
  before () {
    if (vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'beforeUpdate')
    }
  }
}, true /* isRenderWatcher */)
```

* vm.prototype._render()

在`src\core\instance\render.js`中找到`renderMixin`这个方法，它在vm上绑定了`_render`方法
获取了vm.$options中的render函数和_parentVnode(这是自定义组件的虚拟vnode，例如item组件的根元素是section，则section可创建一个vdom，而vue-component-9-Item创建一个虚拟vdom)
接着直接执行了render函数：
`vnode = render.call(vm._renderProxy, vm.$createElement)`
vm._renderProxy 代理了vm的has或get操作

* createElement(context, tag, data, children, normType, alwaysNorm)

data不能被observe(不能有__ob__属性)，否则返回一个空Vnode
对data.is 和 data.key进行检验
children可以是一个函数数组，解析为这种形式:

```javascript
createElement('child', {
// 在数据对象中传递 `scopedSlots`
// 格式为 { name: props => VNode | Array<VNode> }
scopedSlots: {
  default: function (props) { // children[0], return VNode
    return createElement('span', props.text)
  }
}
})
```

创建vnode

```javascript
vnode = new VNode(config.parsePlatformTagName(tag), data, children,undefined, undefined, context) // 内置tag
vnode = createComponent(Ctor, data, context, children, tag) // component，创建一个placeholder的vnode
vnode = new VNode(tag, data, children, undefined, undefined, context) // 其它
```

如果返回值vnode为Array则直接返回，否则对`vnode.data`中的class和style进行observe，然后返回之

* vm.prototype层面的createElement

```javascript
vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false) // 用于内部解析模板
vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true) // 用于用户写的createElement函数
// 最后一个参数为true时默认normType = 2，使用normalizeChildren规整化children数组；normType = 1时使用simpleNormalizeChildren
// simpleNormalizeChildren只能简单地拆两层数组，比如['a', ['b', 'c']]这种，normalizeChildren可以递归处理多层数组，并且可以合并一些相邻的文本节点
```

## `src\core\instance\lifecycle.js` lifecycleMixin 函数

* vm.prototype._update(vnode, hydrating)

先执行`vm._vnode = vnode`，将新的vnode绑定到_vnode属性

```javascript
if (!prevVnode) { // 两种情况，一种是初始化，另一种是更新，都调用的__patch__方法
  // initial render
  vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
} else {
  // updates
  vm.$el = vm.__patch__(prevVnode, vnode)
}
```

* vm.prototype.__patch__ => createPatchFunction({ nodeOps, modules })

nodeOps 封装了一系列 DOM 操作的方法，包括createElement，appendChild，setTextContent等方法

modules 定义了一些模块的钩子函数的实现  
包含ref，directive的操作（ref的操作细节和directive的生命周期都可以从这里看到）

### baseModules

模块都暴露create, update和destroy方法

* ref

ref的核心操作是`const ref = vnode.componentInstance || vnode.elm`, 如果vnode本身是一个组件实例，则返回之，否则返回对应的dom元素

```javascript
if (vnode.data.refInFor) { // 如果ref应用到了v-for上面，则refs[key]对应的是一个数组
  if (!Array.isArray(refs[key])) {
    refs[key] = [ref]
  } else if (refs[key].indexOf(ref) < 0) {
    // $flow-disable-line
    refs[key].push(ref)
  }
} else { // 否则，直接返回一个元素
  refs[key] = ref
}
```

* directives

核心是`_update(oldVnode, vnode)`这个操作，从这个函数中可以分析指令回调的执行时机  
首先如果指令是新加上去的，执行bind，此过程中把新加入的指令加入`dirsWithInsert`  
否则执行update，此过程中把新加入的指令加入`dirsWithPostpatch`  

如果vnode还没有被insert，则把`dirsWithInsert`（`insert`回调集合）中的回调整合进vnode的`insert`回调中,否则直接执行insert回调  
`dirsWithPostpatch`（`componentUpdated`回调集合）被整合进vnode的`postpatch`回调中  

钩子的执行函数：

```javascript
function callHook (dir, hook, vnode, oldVnode, isDestroy) {
  const fn = dir.def && dir.def[hook]
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy) // 这个就是暴露给外部的钩子方法，例如insert(el, binding, vnode, ovnode)
      // dir其实有很多属性可用，v-blue:foo.bar="blue" 可以解析出{arg: "foo", def: {inserted: ƒ}, expression: "'blue'", modifiers: {bar: true}, name: "blue", rawName: "v-blue:foo.bar", value: "blue"}}
    // ...
  }
}
```

### platformModules

包含attr，class，events，style，transition的各种操作  
attr主要针对特殊的dom元素和IE进行兼容（例如inputarea的placeholder发生变化会在IE9和IE10中触发input事件）  
class更新了vdom.ele的class属性，(主要处理了父子层级组件上绑定的class属性，分为staticClass和class两类处理)，_prevClass保存了上一个class属性  
events核心是`updateListeners(on, oldOn, add, remove, createOnceHandler, vnode.context)`这个操作，这个操作就是dom事件绑定、移除的一个封装  
updateProps是反映对`Vnode.data.domProps`的修改，对于`innerHTML, textContent, value`属性的修改有特殊处理步骤  
style主要就是把staticStyle和vnode.data中的style进行合并  
transition操作了一些动画的实施，暴露了`create, activate和remove这几个方法`  



