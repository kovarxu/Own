export const reducers = {
  todos: (state, action) => {
    const { type, payload } = action

    switch (type) {
      case 'SET':
        return payload
      case 'ADD':
        return [ ...state, payload ]
      case 'REMOVE':
        return state.filter(todo => todo.id !== payload)
      case 'TOGGLE':
        return state.map(todo => {
          todo.id === payload && (todo.active = !todo.active)
          return todo
        })
      default:
        return state
    }
  },
  score: (state, action) => {
    const { type, payload } = action

    switch (type) {
      case 'ADD':
        console.log('score add 1')
        return state + 1
      case 'REMOVE':
        console.log('score reset to 0')
        return 0
      default:
        return state
    }
  }
}


export function combineReducers(reducers) {
  return function (state, action) {
    const newState = {}

    for (let key in reducers) {
      const reducer = reducers[key]
      
      newState[key] = reducer(state[key], action)
    }

    return {
      ...state,
      ...newState
    }
  }
}
