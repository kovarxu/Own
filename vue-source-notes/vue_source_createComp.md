* createComponent(Ctor, data, context, children, tag)

`src\core\vdom\create-component.js`

```javascript
export function createComponent (
  Ctor, data, context, children, tag
): VNode | Array<VNode> | void {
  if (isUndef(Ctor)) {
    return
  }

  const baseCtor = context.$options._base

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor) // Ctor如果是一个object，需要用Vue.extend将它转化为一个构造器
  }

  ...

  // async component
  let asyncFactory // 异步组件工厂
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context)
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {}

  resolveConstructorOptions(Ctor) // 将Ctor和Ctor.super的options部分进行对比合并

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data) // 处理model的事件绑定（细节需要具体分析一下）
  }

  // extract props
  const propsData = extractPropsFromVNodeData(data, Ctor, tag) // 对Ctor的propsData中的每一项(k,v)进行操作，从vnode的data中读取attrs和props，然后校验了k是否是异常的（html属性名无大写），从attrs和props中读取出k对应的值，并将其汇总返回回来

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children) // 函数式组件，纯函数式的写法
  }

  const listeners = data.on
  data.on = data.nativeOn

  if (isTrue(Ctor.options.abstract)) { // 抽象组件，仅拥有props, listeners和slot
    // abstract components do not keep anything
    // other than props & listeners & slot
    const slot = data.slot
    data = {}
    if (slot) {
      data.slot = slot
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data) // 挂载init, insert, prepetch, destroy钩子函数

  // return a placeholder vnode
  const name = Ctor.options.name || tag
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context, // 组件vnode中的children是空的，注意
    { Ctor, propsData, listeners, tag, children }, // 传入options
    asyncFactory
  )
  ... // WEEX

  return vnode
}
```