import fetch from '../ajax'

export const INCREMENT = 'INCREMENT'
export const DECREMENT = 'DECREMENT'
export const RESET = 'RESET'

export const FETCH_PRODUCTS_BEGIN   = 'FETCH_PRODUCTS_BEGIN';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';

export const FETCH_USER_BEGIN   = 'FETCH_USER_BEGIN';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

export function increment() {
  return {type: INCREMENT}
}

export function decrement() {
  return {type: DECREMENT}
}

export function reset() {
  return {type: RESET}
}

export const fetchProductsBegin = () => ({
  type: FETCH_PRODUCTS_BEGIN
});

export const fetchProductsSuccess = products => ({
  type: FETCH_PRODUCTS_SUCCESS,
  payload: {products}
});

export const fetchProductsFailure = error => ({
  type: FETCH_PRODUCTS_FAILURE,
  payload: {error}
});

const fetchUserBegin = () => ({
  type: FETCH_USER_BEGIN
});

const fetchUserSuccess = users => ({
  type: FETCH_USER_SUCCESS,
  payload: { user: users.results }
});

const fetchUserFailure = error => ({
  type: FETCH_USER_FAILURE,
  payload: {error}
});

export function getProducts() {
  let url = 'http://localhost:8006/json/products.json'
  return dispatch => {
    dispatch(fetchProductsBegin())
    const req = fetch({url})
    return req
    .then(json => {
      dispatch(fetchProductsSuccess(json))
    })
    .catch(error => dispatch(fetchProductsFailure(error)))
  }
}

export function getUsers() {
  let url = 'https://api.randomuser.me/?results=10'
  return dispatch => {
    dispatch(fetchUserBegin())
    const req = fetch({url})
    return req
    .then(json => {
      dispatch(fetchUserSuccess(json))
    })
    .catch(error => dispatch(fetchUserFailure(error)))
  }
}
