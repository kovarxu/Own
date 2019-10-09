import Vue from 'vue'
import App from './App.vue'

Vue.directive('graybg', {
  bind: (el, binding) => {
    el.style.backgroundColor = "#666"
    console.log('binding: ', binding)
  },
  update: (el, binding) => {
    el.style.backgroundColor = "#666"
    console.log('binding: ', binding)
  },
  inserted: (el, binding) => {
    console.log('directive inserted')
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data () {
    return {
      message: 'message AV'
    }
  },
  mounted () {
    console.log('root component has mounted')
  },
  template: `<App class="maee" :message-box="message" link="go" alias="100" />`,
  components: {
    App
  }
})

// Vue.component('my-app', {
//   functional: true,
//   props: {
//     type: { type: String, default: 'mean' }
//   },
//   render (createElement, context) {
//     console.log('context', context.data)
//     return createElement('div', 'Aha')
//   }
// })

// new Vue({
//   el: "#app",
//   name: 'App',
//   template: `<my-app />`
// })
