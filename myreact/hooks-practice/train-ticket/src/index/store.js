import {
  applyMiddleware,
  createStore,
  combineReducers
} from 'redux';

import thunkMiddleWare from 'redux-thunk';
import reducers from './reducers';

export default createStore(
  combineReducers(reducers),
  {
    from: '北京',
    to: '上海',
    isCitySelectorVisible: false,
    isSelectFrom: false, // 是否回填到from
    cityData: null, // 按需加载的城市数据
    isLoadingCityData: false, // 加载开关，节流操作 
    isOnlyHighSpeed: false,
    isDateSelectorVisible: false,
    selectedDate: null // 目前选择的日期
  },
  applyMiddleware(thunkMiddleWare)
)
