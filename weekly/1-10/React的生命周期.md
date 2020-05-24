## React生命周期

初次学习react，做个总结。

## React16.2之前

### 初始化挂载

* constructor()

* getDefaultProps()

* getInitialState()

* **componentWillMount()**
问题：在SSR时可能执行多次

* render()

* componentDidMount()

### 重渲染

* **componentWillRecevieProps()**
问题：外部组件多次频繁更新传入props，会导致重更新

* shouldComponentUpdate()

* **componentWillUpdate()**
问题：此时获得的dom元素是Render阶段的，可能已经不可信

* render()

* componentDidUpdate()

### 卸载

* componentWillUnmount()

### 16.2之后

React引入了Fiber，将更新分为了Render阶段、Pre-Commit阶段和Commit阶段

Render阶段的钩子都有可能重复执行，所以现在带有Will的生命周期大多变成unsafe的了。

### 初始化挂载

* constructor()

* **getDerivedStateFromProps(nextProps, preState)**
使用这个不能访问this.props, 避免了一些古怪问题，改后这个函数只能用于依照新props更新前一个state。

* render()
* componentDidMount()

### 更新

* **getDerivedStateFromProps(nextProps, preState)**

* shouldComponentUpdate()

* render()

* **getSnapShotBeforeUpdate()**
代替了`componentWillMount()`方法，前者在新的架构下是不安全的，后者保证提供给`componentDidMount()`的dom是更新前的快照。

* componentDidMount()

### 卸载

* componentWillUnmount()
