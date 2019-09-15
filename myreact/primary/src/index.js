import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route, Link } from "react-router-dom"
import { Provider } from 'react-redux'
import store from './store'
import GlobalStyle from './common/global_style'

const App = () => (
  <div>
    <h1>App</h1>
    <ul>
      <li><Link to="/counter">Counter</Link></li>
      <li><Link to="/products">Products</Link></li>
      <li><Link to="/user">User</Link></li>
      <li><Link to="/house">House</Link></li>
      <li><Link to="/want">Want</Link></li>
    </ul>
  </div>
)

const AppRouter = () => (
  <Router>
    <Route exact path="/" component={App} />
  </Router>
)

ReactDOM.render(
  <Provider store={store}>
    <GlobalStyle />
    <AppRouter />
  </Provider>,
  document.getElementById('root')
);

