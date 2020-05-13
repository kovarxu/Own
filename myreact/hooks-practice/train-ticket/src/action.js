export function createSet(payload) {
  return {
    type: 'SET',
    payload
  }
}

export function createAdd(payload) {
  return (dispatch, store) => {
    setTimeout(() => {
      const { todos } = store
      if (!todos.find(todo => todo.value === payload.value)) {
        dispatch({
          type: 'ADD',
          payload
        })
      }
    }, 300)
  }
}

export function createToggle(payload) {
  return {
    type: 'TOGGLE',
    payload
  }
}

export function createRemove(payload) {
  return {
    type: 'REMOVE',
    payload
  }
}

/*
ActionFnc<T=any>: (payload: T) => { key: string, payload: T }
bindActionCreators: (actionMap: {[key: string]: [fn: ActionFunc]}, dispatch: any) => {[P in keyof actionMap]: Function}
*/
export function bindActionCreators(actionMap, dispatch) {
  const ret = {}

  for (let key in actionMap) {
    ret[key] = (...args) => {

      dispatch(actionMap[key].apply(null, args))
    }
  }

  return ret
}
