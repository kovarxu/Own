import Vue from 'vue'
import router from './router'
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

Vue.component('MyTem', {
  data () {
    return {
      isShow: true,
      myClass: { mc: true },
      fly: 'sky'
    }
  },
  filters: {
    fil(target, a, b) {
      return target + a + b
    }
  },
  template: `
    <div v-if="isShow" data-is="wrapper-A" class="static-class" :class="myClass">
      <header>I am a header of the < {{fly | fil('a', 'b')}}</header>
      <div>
        <p v-if="isShow">isShow is true</p>
        <p v-else-if="fly">I can fly in {{fly}}</p>
        <p v-else>Can not show and fly. Stupid you!</p>
      </div>
      <div data-track="luvi">
        <p>this is a broken p tag
        <div>I am div1</div>
        <p>
          I am a normal tag
          <div>I am div2</div>
        </p>
        </br>
        <div style="color: cornflowerblue;"> I am the end</div>
      </div>
    </div>
  `
})

var MyA = Vue.extend({
  data() {
    return {
      name: 'kovar',
      age: 25,
      job: 'programmer',
      address: {
        c1: '广东省',
        c2: '深圳市'
      },
      id: {
        cert: "430X",
        car: '878',
        dog: 'abxxx335'
      }      
    }
  },
  template: `<div>age: {{ age }}</div>`
})

var MyB = MyA.extend({
  data() {
    return {
      age: 27,
      id: {
        cert: '980',
        bird: 'sfdyyy'
      }
    }
  },
  mounted () {
    console.log(this.$data)
  },
  template: `<div>age: {{ age }}</div>`
})

/* eslint-disable no-new */
var myvue = new Vue({
  el: '#app',
  router,
  data () {
    return {
      message: 'avv'
    }
  },
  mounted () {
    console.log('root component has mounted')
  },
  // template: `<App class="maee" :message-box="message" link="go" alias="100" />`,
  // template: `<my-tem />`,
  template: `<MyTem />`,
  components: {
    App, MyB
  }
})

// console.log('app', App)
// // var myvue = new App()
// var myApp = Vue.extend(App)
// var myvue = new myApp()

// new Promise((resolve, reject) => {
//   setTimeout(() => resolve(1), 5000)
// }).then((data) => {
//   myvue.$mount('#app')
// })
