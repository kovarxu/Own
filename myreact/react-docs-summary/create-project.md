# 创建一个项目

项目依赖：

* react, react-dom
* redux, react-redux, 中间件 react-thunk
* react-router, react-router-dom
* styled-components (css in js)
* axios (请求)

loaders:

* babel-loader react-hot-loader
* css-loader style-loader postcss-loader
* svg-inline-loader file-loader url-loader

## Redux

1. reducer联合形成combined reducer
2. combined reducer 和 middleware 通过createStore得到Store 
3. Component 和 state进行connect得到 ComponentWithState
4. 通过`<Provider store={store}>...</Provider>`将Store注入到联合组件内部

更新：

* 在ComponentWithState 内部使用`props.dispatch(getBlogList())`类似的东西，`getBlogList()`定义在action.js中，返回一个类似`{type: REFRESH_BLOG}`的值

## Css in Js

1. 通过`styled-components`实现，可以生成全局样式和局部样式
2. 生成的组件上可以增加`className`属性实现局部css调用

## Router

一般需要 `import { HashRouter as Router, Route, Link } from "react-router-dom"` 这三个组件

通过类似这种方式使用

```js
const AppRouter = () => (
  <Router>
    <Route exact path="/" component={Home} />
    <Route exact path="/blog" component={Blog} />
  </Router>
)

// in navigation
<li>
  <Link to="/lifestorys">Life And Tea</Link>
</li>
```
