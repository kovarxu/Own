import {
  ACTION_SET_IS_SELECT_SEAT_VISIBLE,
  ACTION_SET_AVIABLE_SEAT_ITEMS,
  ACTION_SET_RAW_SEAT_ITEMS,
  ACTION_SET_CHECKED_INDICES,
  ACTION_SET_IS_QUERYING_ITEMS
} from './actions';

export default {
  isSelectSeatVisible(state = false, action) {
    const {
      type,
      payload
    } = action;

    switch (type) {
      case ACTION_SET_IS_SELECT_SEAT_VISIBLE:
        return payload;
      default:
        return state;
    }
  },
  aviableSeatItems(state = [], action) {
    const {
      type,
      payload
    } = action;

    switch (type) {
      case ACTION_SET_AVIABLE_SEAT_ITEMS:
        return payload;
      default:
        return state;
    }
  },
  rawSeatItems(state = [], action) {
    const {
      type,
      payload
    } = action;

    switch (type) {
      case ACTION_SET_RAW_SEAT_ITEMS:
        return payload;
      default:
        return state;
    }
  },
  checkedIndices(state = [], action) {
    const {
      type,
      payload
    } = action;

    switch (type) {
      case ACTION_SET_CHECKED_INDICES:
        return payload;
      default:
        return state;
    }
  },
  isQueryingItems(state = false, action) {
    const {
      type,
      payload
    } = action;

    switch (type) {
      case ACTION_SET_IS_QUERYING_ITEMS:
        return payload;
      default:
        return state;
    }
  }
}