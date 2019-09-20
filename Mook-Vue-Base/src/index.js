import Vue from 'vue'
// import App from './app.vue'

// import './assets/styles/global.styl'
// import './assets/images/sky.jpg'

const root = document.createElement('div')
document.body.appendChild(root)

// Vue.directive('blue', {
//   inserted (el, binding) {
//     console.log('binding', binding)
//     el.style.color = 'blue'
//   }
// })

const App = {
  name: 'app',
  template: '<div>I am an app</div>'
}

const v = new Vue({
  render: h => h(App)
}).$mount(root)
