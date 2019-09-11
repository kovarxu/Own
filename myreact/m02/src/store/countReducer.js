import {INCREMENT, DECREMENT, RESET} from './action'

const initialState = {
  count: 0
}

// never returns undefined from a reducer
// Reducers must be pure functions.
export function reducer(state=initialState, action) {
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