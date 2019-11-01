import Vue from 'vue'
import App from './App.vue'

Vue.directive('graybg', {
  bind: (el, binding) => {
    el.style.backgroundColor = "#666"
    // debugger
    console.log('binding: ', binding)
  },
  update: (el, binding) => {
    //  debugger
    el.style.backgroundColor = "#666"
    console.log('binding: ', binding)
  },
  inserted: (el, binding) => {
    //  debugger
    console.log('directive inserted')
  }
})

Vue.component('com-a', {
  data: {
    opacity: 1
  },
  methods: {
    toggleOpacity () {
      this.opacity = this.opacity === 1 ? 0.6 : 1
      console.log('clicked' + this.opacity)
    }
  },
  props: ['content'],
  // template: `<div @click="toggleOpacity">{{ content }}</div>`
  render (h) {
    return h('div', {
      on: {
        click: this.toggleOpacity
      }
    }, this.opacity || 'no opacity')
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
  // template: `<App class="maee" :message-box="message" link="go" alias="100" />`,
  template: `
    <div>
      <com-a content="I love animals" />
      <com-a content="I love food" />
      <com-a content="I love wool" />
    </div>
  `,
  components: {
    App
  }
})
