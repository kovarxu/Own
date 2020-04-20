## 高级指引

### 代码分割

使用动态import：import().then()

#### React.lazy

React.lazy(fn): 接受一个函数，这个函数需要动态调用 import()。它必须返回一个 Promise，该 Promise 需要 resolve 一个 defalut export 的 React 组件。

`React.lazy(() => import('./OtherComponent'))`

#### Suspense

React.Suspense组件有一个fallback属性，定义它可以实现loading的效果

```js
function MyComponent () {
  return (
    <Suspense fallback={<div>Now Loading ...</div>}>
      <section>
        <OtherComponent />
      </section>
    </Suspense>
  )
}
```

#### 结合react-router-dom使用

```js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
      </Switch>
    </Suspense>
  </Router>
);
```

### Context

目的：类似于Provide、Inject的依赖注入

#### 创建

`const MyContext = React.createContext(defaultValue);`

#### 使用

* 设定class的static属性`Myclass.contextType = Mycontext; // 在组件中使用this.context拿到属性`  
* 在父组件中可以用`<Mycontext.Provide value={ // 某个值 }>...</Mycontext.Provide>`的形式
* 在函数式组件中可以用`<Mycontext.Consume>{ value => // 基于某个值进行渲染 }</MyContext.Consume>`

设定class的displayName属性`MyContext.displayName = 'MyDisplayName'; // 有利于devtools分析`

### Render-Props

类似于作用于插槽（父亲“获取得到”儿子的states）

形式：

```js
// 子组件中
class Child {
  constructor () {
    ...
    this.state = { x: 0, y: 0 }
  }
  render () {
    return (
      <>
        <p>********** Child CopyRight **********</p>
        { this.props.render(this.state) }
      </>
    )
  }
}

// 父组件中
// class Cat 使用了Child获取的mouse信息，Child渲染了另一个组件传入的组件Mouse
class Father {
  render () {
    return (
      // 为了性能考虑，mouse => <Mouse mouse={mouse}> 这一截应该拎出来作为一个单独函数
      <Child render={ mouse => <Mouse mouse={mouse}> } />
    )
  }
}
```

### refs

适合用refs的场景：
* 管理焦点，文本选择或媒体播放。
* 触发强制动画。
* 集成第三方 DOM 库。

避免使用 refs 来做任何可以通过声明式实现来完成的事情。

举个例子，避免在 Dialog 组件里暴露 open() 和 close() 方法，最好传递 isOpen 属性。

**只有类组件可以使用，函数式组件使用useRef**

#### 创建

类似Vue，ref如果放到一个Dom元素上，则表示dom节点；如果放到一个组件上，则表示一个组件实例

```js
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
}

// 使用：this.myRef.current
```

#### 函数式组件

```js
function CustomTextInput(props) {
  // 这里必须声明 textInput，这样 ref 才可以引用它
  const textInput = useRef(null);

  function handleClick() {
    textInput.current.focus();
  }

  render () { ... }
}
```

#### 回调Refs

可以玩骚操作

```js
// 父组件
class Father {
  constructor () {
    this.domRef = null

    this.setDomRef = element => {
      this.domRef = element
    }
  }

  render () {
    return (
      <>
        <Child setDom={this.setDomRef} />
        <p>{this.domRef ? '空' : this.domRef.value}</p>
      </>
    )
  }
}

// 子组件
class Child {
  constructor () {
    ...
  }
  render () {
    <div>
      <p2>Ok</p2>
      <input ref={this.props.setDomRef} />
    </div>
  }
}
```

React 将在组件挂载时，会调用 ref 回调函数并传入 DOM 元素，当卸载时调用它并传入 null。  
在 componentDidMount 或 componentDidUpdate 触发前，React 会保证 refs 一定是最新的。

如果 ref 回调函数是以内联函数的方式定义的，在更新过程中它会被执行**两次**，第一次传入参数 null，然后第二次会传入参数 DOM 元素。  
这是因为在每次渲染时会创建一个新的函数实例，所以 React 清空旧的 ref 并且设置新的。通过将 ref 的回调函数定义成 class 的绑定函数的方式可以避免上述问题，但是大多数情况下它是无关紧要的。

#### 转发refs

也可以实现父组件获取子组件的DOM

```js
// 有forward的意思就是想把自己的节点暴露出去
const Child = React.forwardRef((props, ref) => (
  <div ref={ref}>{props.children}</div>
))

const ref = React.createRef()
<Child ref={ref}>It is a nice world!</Child>
```

### Fragments

片段元素，使用`<React.Fragment></React.Fragment>`或者简写为`<></>`

### 高阶组件

高阶组件是参数为组件，返回值为新组件的函数。

HOC 在 React 的第三方库中很常见，例如 Redux 的 connect 和 Relay 的 createFragmentContainer。

HOC 不会修改传入的组件，也不会使用继承来复制其行为。相反，HOC 通过将组件包装在容器组件中来组成新组件。HOC 是纯函数，没有副作用。

```js
function createComponent(WrappedComp, data) {
  return class extends React.Component {
    ...
    render () {
      return (
        <WrappedComp data={this.state.data} {...this.props} />
      )
    }
  }
}

```

修改传入组件的 HOC 是一种糟糕的抽象方式。调用者必须知道他们是如何实现的，以避免与其他 HOC 发生冲突。

注意给组件一个displayName属性，表明它在React调试面板中的信息：`WithSubscription.displayName`

#### 注意事项

* 不要在render函数中生成高阶组件，这样每次render都会重复生成，浪费性能
* 务必复制静态方法，可以使用`hoist-non-react-statics`
* Refs不会传递，因为ref和key一样是特殊的键，并不在props中处理
* 这东西非常灵活，写起来很爽，但是越是自由度高的东西，驾驭难度越大

### 深入jsx

实际上，JSX 仅仅只是 `React.createElement(component, props, ...children)` 函数的语法糖。

组件名称可以使用点语法，但用户定义的组件名称必须以大写字母开头

布尔值、null以及undefined会在渲染过程中被忽略，**但是0不会**

```js
// 这段代码当message为空的时候渲染0而不是什么都不做
<div>
  {props.messages.length &&
    <MessageList messages={props.messages} />
  }
</div>
```

### portals

可以将组件渲染进某个dom内部

用法：在render函数中返回创建的portals

`ReactDOM.createPortal(child, container)`, child为子组件，container为包含dom

#### 进行事件冒泡

注意react中合成事件可以被portals挂载的父组件获取到

### profiler API

用来测试性能，不能用于生产环境

`<Profiler id="child" onRender="{callback}"><Child /></Profiler>`

```js
function callback(
  id, // 发生提交的 Profiler 树的 “id”
  phase, // "mount" （如果组件树刚加载） 或者 "update" （如果它重渲染了）之一
  actualDuration, // 本次更新 committed 花费的渲染时间
  baseDuration, // 估计不使用 memoization 的情况下渲染整颗子树需要的时间
  startTime, // 本次更新中 React 开始渲染的时间
  commitTime, // 本次更新中 React committed 的时间
  interactions // 属于本次更新的 interactions 的集合
) {
  // 合计或记录渲染时间。。。
}
```
