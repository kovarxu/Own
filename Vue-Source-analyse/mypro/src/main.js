import Vue from 'vue'
import router from './router'
import App from './App.vue'
import B from './components/B.vue'
import V from './components/V.vue'
import D from './components/D.vue'
import F from './components/f.js'
// import myFoo from './ok.js'
// console.log('foo ' + myFoo)

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

Vue.component('Sl', {
  name: 'slotl',
  data () {
    return {
      defaultFloorPatterns: [
        '***************',
        '###############',
        '@@@@@@@@@@@@@@@'
      ]
    }
  },
  template: `
    <div>
      <h3>Hear is the roof</h3>
      <slot>
        <p>house body</p>
      </slot>
      <slot name="floor" :patterns="defaultFloorPatterns">
        <p>----- the floor -----</p>
      </slot>
      <slot name="basement" :patterns="defaultFloorPatterns">
        <p>basement</p>
      </slot>
    </div>
  `
})


/* eslint-disable no-new */
var myvue = new Vue({
  router,
  data () {
    return {
      message: 'vvvbvvvv',
      sel: 2,
      nut: 1,
    }
  },
  mounted () {
    console.log('root component has mounted')
  },
  methods: {
    // handleClick($event) {console.log($event)}
  },
  // template: `<App class="maee" :message-box="message" link="go" alias="100" />`,
  // template: `<my-tem />`,
  // template: `<V v-model="nut" />`,
  // template: `<div>softly <D /></div>`,
  template: `<sl>
              <div>
                <p>my table</p>
                <p>my chair</p>
                <p>my bed</p>
              </div>

              <template v-slot:floor="p">
                <p>{{ p.patterns[1] }}</p>
              </template>

              <D v-slot="pl">
                {{ pl.car }}
              </D>

              <template slot="basement">
                I am a new basement
              </template>

              <router-view name="default" />
            </sl>`,
  // template: `<Fun :mes="message" :bor="{a: 1}" @click="handleClick">AAA<template v-slot:man="G">MMM{{G.bor.a}}</template></Fun>`,
  // template: `<Sow><template v-slot:foo="G">MMM{{G.sow}}  {{message}}</template></Sow>`,
  // template: `<B @click="handleClick" :msg.sync="message"></B>`,
  // template: `<fn-boy :sel="sel" :bar="message">Hello my boy!<template v-slot:man="G">{{G.bar}}</template></fn-boy>`,
  components: {
    // App,
    // B,
    // V,
    D,

  }
}).$mount('#app')