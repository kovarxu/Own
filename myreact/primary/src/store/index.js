import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'react-thunk'
import { headerReducer } from './common/header'
const routeReducer = combineReducers({
  header: headerReducer
})

export default createStore(routeReducer, applyMiddleware(thunk))
