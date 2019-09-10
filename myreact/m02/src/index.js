import React from 'react'
import ReactDOM from 'react-dom'
import './index.css';
import Counter from './counter'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import {INCREMENT, DECREMENT, RESET} from './action'

const initialState = {
  count: 0,
  loading: true,
  error: null,
  data: null
}
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

// never returns undefined from a reducer
// Reducers must be pure functions.
function reducer(state=initialState, action) {
  console.log('reducer ', state, action)
  switch(action.type) {
    case INCREMENT:
      return Object.assign({}, state, {count: state.count + 1})
    case DECREMENT:
      return Object.assign({}, state, {count: state.count - 1})
    case RESET:
      return Object.assign({}, state, {count: 0})
    default:
      return state
  }
}

function getRandom() {
  return Math.random().toString(36).substr(2).toUpperCase()
}
