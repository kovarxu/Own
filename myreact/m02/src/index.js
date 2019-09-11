import React from 'react'
import ReactDOM from 'react-dom'
import './css/index.css';
import Counter from './counter'
import Products from './products'
import House from './house'
import Rack from './rack'
import User from './user'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import rootReducer from './store/rootReducer'

const store = createStore(rootReducer, applyMiddleware(thunk))

const App = () => (
  <Provider store={store}>
    <Counter />
    <Products />
    <House />
    <Rack />
    <User />
  </Provider>
)

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
