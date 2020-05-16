import React, { Component, useRef } from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleWare from 'redux-thunk';
import { Provider, connect } from "react-redux";

// actions
const ADD_ACT = 'ADD_ACT'
const RESET_ACT = 'RESET_ACT'
const MAGIC_ACT = 'MAGIC_ACT'

const addScore = (payload) => ({
  type: ADD_ACT,
  payload
})

const resetScore = () => ({
  type: RESET_ACT,
  payload: 0
})

const magicScore = (payload) => (dispatch, getState) => {
  const score = getState().score

  if (score === payload) {
    return dispatch({
      type: MAGIC_ACT,
      payload
    })
  }
}

// reducers
const initialState = {
  score: 0
}

const reducer = (state = initialState, action) => {
  const { type, payload } = action

  switch(type) {
    case ADD_ACT:
      return { ...state, score: state.score + payload }
    case RESET_ACT:
      return { ...state, score: 0 }
    case MAGIC_ACT:
      return { ...state, score: state.score * 2 }
    default:
      return state
  }
}

// 可以配合reducers
// const reducers = { main: reducer }

// store
const store = createStore(reducer, applyMiddleware(thunkMiddleWare))

// Foo
const Foo = connect(state => {
  return { score: state.score }
}, (dispatch, ownProps) => {
  return { 
    addScore: (payload) => dispatch(addScore(payload)),
    resetScore: () => dispatch(resetScore()),
    magicScore: (payload) => dispatch(magicScore(payload))
  } 
})((props) => {
  const { dispatch, addScore, magicScore, resetScore } = props
  const inputRef = useRef()

  const handleClick = () => {
    addScore(1)
  }

  const handleContextMenu = (e) => {
    e.preventDefault()
    resetScore()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const value = +inputRef.current.value
    magicScore(value)
    inputRef.current.value = ''
  }

  return (
    <>
      <div onClick={handleClick} onContextMenu={handleContextMenu}>{props.score}</div>
      <form onSubmit={handleSubmit}>
        <input ref={inputRef} />  
      </form>
    </>
  );
})
 

class App extends Component {
  state = {  }
  render() { 
    return (
      <Provider store={store}>
        <div>
          <Foo />
          App!
        </div>
      </Provider>
    );
  }
}
 
export default App;
