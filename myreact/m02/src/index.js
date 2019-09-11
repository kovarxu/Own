import React from 'react'
import ReactDOM from 'react-dom'
import './css/index.css';
import Counter from './counter'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import {reducer} from './store'

const store = createStore(reducer, applyMiddleware(thunk))

const App = () => (
  <Provider store={store}>
    <Counter />
  </Provider>
)

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
