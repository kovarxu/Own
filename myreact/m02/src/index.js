import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route, Link } from "react-router-dom";
import './css/index.css';
import GlobalStyle from './page/global_style'
import Counter from './page/counter'
import Products from './page/products'
import House from './page/house'
import User from './page/user'
import Want from './page/want/want'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import rootReducer from './store/rootReducer'

const store = createStore(rootReducer, applyMiddleware(thunk))

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
    <Route path="/counter" component={Counter} />
    <Route path="/products" component={Products} />
    <Route path="/user" component={User} />
    <Route path="/want" component={Want} />
    <Route path="/house" component={House} />
  </Router>
)

ReactDOM.render(
  <Provider store={store}>
    <GlobalStyle />
    <AppRouter />
  </Provider>,
  document.getElementById('root')
);
