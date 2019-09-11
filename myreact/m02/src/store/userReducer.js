import {
  FETCH_USER_BEGIN,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE
} from './action';

const initialState = {
  users: [],
  loading: false,
  error: null,
  startTimer: null,
  endTimer: null
};

export default function userReducer(state = initialState, action) {
  switch(action.type) {
    case FETCH_USER_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
        startTimer: new Date
      };

    case FETCH_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload.user,
        endTimer: new Date
      };

    case FETCH_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        users: []
      };

    default:
      // ALWAYS have a default case in a reducer
      return state;
  }
}
