import {
  ACTION_SET_FOO,
  ACTION_SET_BAR,
  ACTION_SET_IS_ONLINE,
  ACTION_SET_IS_OFFLINE_VISIBLE,
  ACTION_SET_SHOWN_DATA,
} from './actions';

export default {
  foo (state, action) {
    const { type, payload } = action;

    switch (type) {
      case ACTION_SET_FOO:
        return payload;
      defalut:
        return state;
    }
  },
  bar (state, action) {
    const { type, payload } = action;

    switch (type) {
      case ACTION_SET_BAR:
        return payload;
      defalut:
        return state;
    }
  },
  isOnline (state, action) {
    const { type, payload } = action;

    switch (type) {
      case ACTION_SET_IS_ONLINE:
        return payload;
      defalut:
        return state;
    }
  },
  isOfflineVisible (state, action) {
    const { type, payload } = action;

    switch (type) {
      case ACTION_SET_IS_OFFLINE_VISIBLE:
        return payload;
      defalut:
        return state;
    }
  },
  shownData (state, action) {
    const { type, payload } = action;

    switch (type) {
      case ACTION_SET_SHOWN_DATA:
        return payload;
      defalut:
        return state;
    }
  },
}
