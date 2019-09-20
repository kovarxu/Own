import {
  FETCH_BLOGLIST_BEGIN,
  FETCH_BLOGLIST_SUCCESS,
  FETCH_BLOGLIST_FAIL
} from './action'

const initialState = {
  loading: false,
  error: null,
  blogs: []
}

export default function blogReducer(state = initialState, action) {
  switch(action.type) {
    case FETCH_BLOGLIST_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      }

    case FETCH_BLOGLIST_SUCCESS:
      return {
        ...state,
        loading: false,
        blogs: action.payload.blogs
      }

    case FETCH_BLOGLIST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        blogs: []
      }

    default:
      // ALWAYS have a default case in a reducer
      return state
  }
}
