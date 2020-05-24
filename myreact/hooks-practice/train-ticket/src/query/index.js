import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import 'normalize.css/normalize.css';

import store from './store';
import './index.css';
import App from './App';

ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>, 
  document.getElementById('root')
)

// whistle
// /\/static\/insuranceV2\/(.*)/ file://E:/Projects/web/insuranceV2/insuranceV2/$1
// http://dev.xinhulu.com tpl://{mock-test}
// http://dev.xinhulu.com js://E:/inject.js
// https://beta.xinhulu.com log://