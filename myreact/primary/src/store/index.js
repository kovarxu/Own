import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import headerReducer from '../common/header/reducer'
import blogReducer from '../page/blog/reducer'

const routeReducer = combineReducers({
  header: headerReducer,
  blog: blogReducer
})

export default createStore(routeReducer, applyMiddleware(thunk))
