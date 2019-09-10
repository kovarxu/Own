import fetch from './ajax'

export const INCREMENT = 'INCREMENT'
export const DECREMENT = 'DECREMENT'
export const RESET = 'RESET'
export const FETCH_PRODUCTS_BEGIN   = 'FETCH_PRODUCTS_BEGIN';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';

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
  payload: products
});

export const fetchProductsFailure = error => ({
  type: FETCH_PRODUCTS_FAILURE,
  payload: error
});

export function getProducts() {
  let url = 'http://localhost:8006/json/profile.json'
  return dispatch => {
    dispatch(fetchProductsBegin())
    const req = fetch({url})
    return req
    .then(json => {
      console.log(json)
      dispatch(fetchProductsSuccess(json))
    })
    .catch(error => dispatch(fetchProductsFailure(error)))
  }
}
