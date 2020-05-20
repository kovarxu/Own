export const ACTION_SET_FROM = 'ACTION_SET_FROM';
export const ACTION_SET_TO = 'ACTION_SET_TO';
export const ACTION_SET_IS_CITY_SELECTOR_VISIBLE = 'ACTION_SET_IS_CITY_SELECTOR_VISIBLE';
export const ACTION_SET_IS_SELECT_FROM = 'ACTION_SET_IS_SELECT_FROM';
export const ACTION_SET_CITY_DATA = 'ACTION_SET_CITY_DATA';
export const ACTION_SET_IS_LOADING_CITY_DATA = 'ACTION_SET_IS_LOADING_CITY_DATA';
export const ACTION_SET_IS_ONLY_HIGH_SPEED = 'ACTION_SET_IS_ONLY_HIGH_SPEED';
export const ACTION_SET_IS_DATE_SELECTOR_VISIBLE = 'ACTION_SET_IS_DATE_SELECTOR_VISIBLE';
export const ACTION_SET_SELECTED_DATE = 'ACTION_SET_SELECTED_DATE';

// 可以直接被变更的状态
export function setFrom(payload) {
  return {
    type: ACTION_SET_FROM,
    payload
  }
}
export function setTo(payload) {
  return {
    type: ACTION_SET_TO,
    payload
  }
}
export function setCityData(payload) {
  return {
    type: ACTION_SET_CITY_DATA,
    payload
  }
}
export function setIsLoadingCityData(payload) {
  return {
    type: ACTION_SET_IS_LOADING_CITY_DATA,
    payload
  }
}

// 交互一，点击展示城市选择浮层，关闭浮层
export function showCitySelector (isSelectFrom) {
  return (dispatch) => {
    dispatch({
      type: ACTION_SET_IS_CITY_SELECTOR_VISIBLE,
      payload: true
    })

    dispatch({
      type: ACTION_SET_IS_SELECT_FROM,
      payload: isSelectFrom
    })
  }
}

export function hideCitySelector () {
  return {
    type: ACTION_SET_IS_CITY_SELECTOR_VISIBLE,
    payload: false
  }
}

export function setSelectedCity (city) {
  return (dispatch, getState) => {
    const { isSelectFrom } = getState();

    dispatch(
      isSelectFrom ? setFrom(city) : setTo(city)
    )

    dispatch(hideCitySelector())
  }
}

// 交互二，点击展示日期选择浮层，关闭浮层

export function showDeteSelector () {
  return {
    type: ACTION_SET_IS_DATE_SELECTOR_VISIBLE,
    payload: true
  }
}

export function hideDeteSelector () {
  return {
    type: ACTION_SET_IS_DATE_SELECTOR_VISIBLE,
    payload: false
  }
}

export function setSelectedDate(payload) {
  return (dispatch) => {
    dispatch({
      type: ACTION_SET_SELECTED_DATE,
      payload
    })

    dispatch(hideDeteSelector());
  }
}

// 交互三，切换只展示高铁
export function toggleOnlyHighSpeed() {
  return (dispatch, getState) => {
    const { isOnlyHighSpeed } = getState();

    dispatch({
      type: ACTION_SET_IS_ONLY_HIGH_SPEED,
      payload: !isOnlyHighSpeed
    })
  }
}

// 交互四，交换始到站
export function exchangeToFrom () {
  return (dispatch, getState) => {
    const { to, from } = getState();

    dispatch(setFrom(to));
    dispatch(setTo(from));
  }
}

// 请求数据一，请求城市列表数据
// 缓存键
const CITY_LOCAL_KEY = '@#_city—local_key';
const CACHE_TIME = 60 * 1000;

export function fetchCityData () {
  return (dispatch, getState) => {
    const { isLoadingCityData } = getState();

    // 如果有缓存，读缓存
    const localData = JSON.parse(localStorage.getItem(CITY_LOCAL_KEY) || 'null');
    if (localData && localData.timestamp >= new Date().getTime() - CACHE_TIME) {
      return dispatch(setCityData(localData.city));
    }
    
    if (isLoadingCityData) {
      return;
    }
    dispatch(setIsLoadingCityData(true));
    fetch('/source/cities')
      .then(data => data.json())
      .then(data => {
        console.log(data);
        dispatch(setCityData(data));
        // 设缓存
        localStorage.setItem(CITY_LOCAL_KEY, JSON.stringify({
          city: data,
          timestamp: new Date().getTime()
        }))
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        dispatch(setIsLoadingCityData(false));
      })
  }
}
