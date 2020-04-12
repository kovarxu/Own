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
// class Cat 使用了Child中的mouse信息
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

也可以实现父组件获取子组件的Dom

```js
const Child = React.forwardRef((props, ref) => (
  <div ref={ref}>{props.children}</div>
))

const ref = React.createRef()
<Child ref={ref}>It is a nice world!</Child>
```




