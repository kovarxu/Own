import { combineReducers } from "redux"
import products from "./productReducer"
import users from './userReducer'
import count from './countReducer'

export default combineReducers({
  count,
  products,
  users
})
