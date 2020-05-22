export const ACTION_SET_FOO = 'ACTION_SET_FOO';
export const ACTION_SET_BAR = 'ACTION_SET_BAR';
export const ACTION_SET_IS_ONLINE = 'ACTION_SET_IS_ONLINE';
export const ACTION_SET_IS_OFFLINE_VISIBLE = 'ACTION_SET_IS_OFFLINE_VISIBLE';
export const ACTION_SET_SHOWN_DATA = 'ACTION_SET_SHOWN_DATA';

export function setFoo(foo) {
  return {
    type:ACTION_SET_FOO,
    payload: foo
  }
}
export function setBar(bar) {
  return {
    type:ACTION_SET_BAR,
    payload: bar
  }
}
export function setIsOnline(isOnline) {
  return {
    type:ACTION_SET_IS_ONLINE,
    payload: isOnline
  }
}
export function setIsOfflineVisible(isOfflineVisible) {
  return {
    type:ACTION_SET_IS_OFFLINE_VISIBLE,
    payload: isOfflineVisible
  }
}
export function setShownData(shownData) {
  return {
    type:ACTION_SET_SHOWN_DATA,
    payload: shownData
  }
}

