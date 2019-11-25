import Vue from 'vue';
import App from './app/app.vue'

import './assets/set.css'
require('jsPlumb')

new Vue({
  render: h => h(App)
}).$mount('#app')
