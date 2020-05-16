import {
  applyMiddleware,
  createStore,
  combineReducers
} from 'redux';

import thunkMiddleWare from 'redux-thunk';
import reducers from './reducers';

export default createStore(
  combineReducers(reducers),
  {},
  applyMiddleware(thunkMiddleWare)
)
