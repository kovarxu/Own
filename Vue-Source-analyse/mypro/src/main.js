import Vue from 'vue'
import App from './App.vue'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data () {
    return {
      message: 'message AV'
    }
  },
  template: `<App class="maee" :message="message" />`,
  components: {
    App
  }
  // render (createElement) {
  //   return createElement('div', {
  //     attrs: {
  //       id: '#acc'
  //     }
  //   }, 'I am an app')
  // },
  // template: `<div>{{ message }}</div>`
})
