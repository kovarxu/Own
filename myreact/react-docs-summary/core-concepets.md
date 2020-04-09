## 核心概念

### jsx简介

jsx其实是一个表达式，里面使用大括号表示可以执行的语句

`<div>My name is {name ? name : 'anonymous'}</div>`

等效形式：`React.createElement`

```js
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);

// 等效为
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```

### 渲染元素

`ReactDom.render(element, document.getElementById('root'))`

### 组件&props

props不需事先声明的，直接传入即可，通过`props.xxx`方式读取

eg1: `function Foo(props) { return (<h3>{ props.title }</h3>) }`

eg2: `class Foo { render () { return (<h3>{ this.props.title }</h3>) } }`

### state & 生命周期

class组件有`生命周期`和`state`

```js
class Clock extends React.Component {
  constructor (props) {
    super(props)
    this.state = { data: new Date() }
  }
  render () {...}
}
```

修改state: `this.setState(updater, [callback])`

    `setState()` 并不总是立即更新组件。它会批量推迟更新。这使得在调用 `setState()` 后立即读取 `this.state` 成为了隐患。为了消除隐患，请使用 `componentDidUpdate` 或者 `setState` 的回调函数（`setState(updater, callback)`），这两种方式都可以保证在应用更新后触发。

    `setState()` 的第二个参数为可选的回调函数，它将在 `setState` 完成合并并重新渲染组件后执行。通常，我们建议使用 `componentDidUpdate()` 来代替此方式。

`updater: (state, props) => stateChange` 是一个更新函数，`updater` 函数中接收的 `state` 和 `props` 都保证为最新。`updater` 的返回值会与 `state` 进行浅合并。

`updater`也可以是一个对象，这种情况下多次`setState`会合并，所以如果`updater`依赖当前`state`，就不要这么干。

### 事件处理

需要注意的是方法本身需要在`constructor`中绑定（这是js的问题）,可选用实验语法（实验性语法）和jsx中用箭头函数（渲染时会重新创建）

### 条件渲染

使用js的机制即可：if else; &&; 三目运算符等

组织条件渲染：render返回null即可

### 列表渲染

使用map可以做到列表渲染，注意给key

map有几种风格：1循环部分提出来创建好；2在jsx大括号中用map；3创建一个额外的组件

### 表单

受控组件：放弃了自身行为，state依赖react组件的表单元素

```js
// https://codesandbox.io/ 可以在线写react代码，很赞
import React from "react";

class MyInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
    this.handleValueChange = this.handleValueChange.bind(this);
  }

  handleValueChange(e) {
    console.log("you changed the body!");
    this.setState({
      value: e.target.value
    });
  }

  render() {
    return (
      <input
        placeholder="请输入您的手机号"
        type="tel"
        onChange={this.handleValueChange}
        value={this.state.value}
      />
    );
  }
}

export default MyInput;
```

还有诸如`textarea, select`标签均可

### 状态提升

在父组件中分发props和修改事件到子组件的传值方式

### 组合&继承

类似插槽

定义：
```js
render () {
  return (
    <div>
      Hear are some bad ideas:
      {props.left}
      {props.right}
      Hear are some good ones:
      {props.children}
    </div>
  )
}
```

使用：
```js
<Father
  left={<A />}
  right={<B />}
>
  <C />
</Father>
```
