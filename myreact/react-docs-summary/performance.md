## 性能优化

### 思路

1. 减少render次数
2. 减少计算次数

### shouldComponentUpdate & PureComponent

类似的用法：

```js
shouldComponentUpdate(nextProps, nextState) {
  if (this.props.color !== nextProps.color) {
    return true;
  }
  if (this.state.count !== nextState.count) {
    return true;
  }
  return false;
}
```

使用`class Foo extends React.PureComponent {}`更方便，但是它只有浅层次比较，深层次的需要自己实现

### React.memo

本质是一个高阶组件

作用：给相同props的子组件提供缓存，记忆子组件的渲染结果

基础使用：`function Child() {}; export default MyChild = React.memo(Child)`

高级使用：使用第二个参数来决定是否用缓存

`function areEqual(prevProps, nextProps) { // return true 用缓存，否则不用 }`
`function Child() {}; export default MyChild = React.memo(Child, areEqual)`

### useCallback

这个情况出现的原因是函数式组件每次执行render的时候函数重新执行，传入子组件的监听函数重复构建了。

`const memCallback = useCallback(callback, [])`, 第二个参数作为依赖，使用方式与`useEffect`类似

### useMemo

同样用在函数式组件中，如果一个函数执行非常耗时，可以缓存其结果

`const memFunc = useMemo(func, [])`, 第二个参数作为依赖
