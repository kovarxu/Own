import Vue from 'vue'
import App from './app.vue'

new Vue({
  name: 'Main',
  render: h => h(App),
  components: {
    App
  }
}).$mount(document.querySelector('#app'))
