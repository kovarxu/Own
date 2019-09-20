import fetch from '../../util/ajax'

export const FETCH_BLOGLIST_BEGIN = 'FETCH_BLOGLIST_BEGIN'
export const FETCH_BLOGLIST_SUCCESS = 'FETCH_BLOGLIST_SUCCESS'
export const FETCH_BLOGLIST_FAIL = 'FETCH_BLOGLIST_FAIL'

function fetchBegin () {
  return {
    type: FETCH_BLOGLIST_BEGIN
  }
}

function fetchSucc (blogs) {
  return {
    type: FETCH_BLOGLIST_SUCCESS,
    payload: { blogs } 
  }
}

function fetchFail (error) {
  return {
    type: FETCH_BLOGLIST_FAIL,
    payload: { error }
  }
}

export function getBlogList () {
  let url = 'http://localhost:8062/json/bloglist.json'
  return dispatch => {
    dispatch(fetchBegin())
    const req = fetch({url})
    return req
      .then(json => {
        dispatch(fetchSucc(json))
      })
      .catch(error => dispatch(fetchFail(error)))
  }
}
