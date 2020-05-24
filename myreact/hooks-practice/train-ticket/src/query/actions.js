export const ACTION_SET_IS_SELECT_SEAT_VISIBLE = 'ACTION_SET_IS_SELECT_SEAT_VISIBLE';
export const ACTION_SET_AVIABLE_SEAT_ITEMS = 'ACTION_SET_AVIABLE_SEAT_ITEMS';
export const ACTION_SET_RAW_SEAT_ITEMS = 'ACTION_SET_RAW_SEAT_ITEMS';
export const ACTION_SET_CHECKED_INDICES = 'ACTION_SET_CHECKED_INDICES';
export const ACTION_SET_IS_QUERYING_ITEMS = 'ACTION_SET_IS_QUERYING_ITEMS';

export function showSelectSeat () {
  return (dispatch) => {
    dispatch({
      type: ACTION_SET_IS_SELECT_SEAT_VISIBLE,
      payload: true
    })
    dispatch(queryAvaItems());
  }
}
export function hideSelectSeat () {
  return {
    type: ACTION_SET_IS_SELECT_SEAT_VISIBLE,
    payload: false
  }
}
export function setAviableSeatItems (aviableSeatItems) {
  return {
    type: ACTION_SET_AVIABLE_SEAT_ITEMS,
    payload: aviableSeatItems
  }
}
export function setRawSeatItems (rawSeatItems) {
  return (dispatch, getState) => {
    dispatch({
      type: ACTION_SET_RAW_SEAT_ITEMS,
      payload: rawSeatItems
    })

    const { checkedIndices } = getState();
    const cpy = [...rawSeatItems];
    if (checkedIndices.includes(0) && checkedIndices.includes(1)) {
      cpy.pop();
    }
    dispatch({
      type: ACTION_SET_AVIABLE_SEAT_ITEMS,
      payload: cpy
    })
  }
}
export function setCheckedIndices (checkedIndices) {
  return (dispatch, getState) => {
    const { rawSeatItems } = getState();
    const cpy = [...rawSeatItems];

    if (checkedIndices.includes(0) && checkedIndices.includes(1)) {
      cpy.splice(3);
      checkedIndices = checkedIndices.filter(item => item !== 3);
    }

    dispatch({
      type: ACTION_SET_AVIABLE_SEAT_ITEMS,
      payload: cpy
    })

    dispatch({
      type: ACTION_SET_CHECKED_INDICES,
      payload: checkedIndices
    })
  }
}
export function setIsQueryingItems (isQueryingItems) {
  return {
    type: ACTION_SET_IS_QUERYING_ITEMS,
    payload: isQueryingItems
  }
}
export function queryAvaItems () {
  return (dispatch, getState) => {
    const { isQueryingItems } = getState();

    if (isQueryingItems) {
      return ;
    }

    dispatch(setIsQueryingItems(true));
    fetch('/avaitems')
      .then(data => data.json())
      .then(data => {
        if (data.code === 0) {
          return data.data;
        } else {
          return new Error(data.errmsg);
        }
      })
      .then(items => {
        dispatch(setRawSeatItems(items));
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        dispatch(setIsQueryingItems(false));
      })
  }
}