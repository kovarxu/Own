import Vue from 'vue'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data () {
    return {
      message: 'message AV'
    }
  },
  // render (createElement) {
  //   return createElement('div', {
  //     attrs: {
  //       id: '#acc'
  //     }
  //   }, 'I am an app')
  // },
  template: `<div>{{ message }}</div>`
})
