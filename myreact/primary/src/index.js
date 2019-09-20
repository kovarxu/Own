import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route, Link } from "react-router-dom"
import { Provider } from 'react-redux'
import store from './store'
import GlobalStyle from './common/global_style'

import Home from './page/home'
import Blog from './page/blog'

const AppRouter = () => (
  <Router>
    <Route exact path="/" component={Home} />
    <Route exact path="/blog" component={Blog} />
  </Router>
)

ReactDOM.render(
  <Provider store={store}>
    <GlobalStyle />
    <AppRouter />
  </Provider>,
  document.getElementById('root')
)
