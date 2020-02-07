import Vue from 'vue'
import router from './router'
import App from './App.vue'
import B from './components/B.vue'
import V from './components/V.vue'
import D from './components/D.vue'
import F from './components/f.js'

console.log('M ', M)

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

Vue.component(F.name, F)

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
  methods: {
    modEvent (e) {
      console.log(e)
    }
  },
  template: `
    <div v-if="isShow" data-is="wrapper-A" class="static-class" :class="myClass">
      <header>I am a header of the < {{fly | fil('a', 'b')}}</header>
      <button @click.right.ctrl="handleClick"
              @change.native="handleClick"
      >ClickMe!</button>
      <div @click="handleClick">
      <header v-graybg.tfboy="bname">I am a header of the < {{fly | fil('a', 'b')}}</header>
      <input v-model="fly" />
      <div>
        <p v-if="isShow">isShow is true</p>
        <p v-else-if="fly">I can fly in {{fly}}</p>
        <p v-else>Can not show and fly. Stupid you!</p>
      </div>
      <div data-track="luvi" @click.left.ctrl="modEvent($event)">
        <p>this is a broken p tag
        <div>I am div1</div>
        <p>
          I am a normal tag
          <div>I am div2</div>
        </p>
        </br>
        <div style="color: cornflowerblue;"> I am the end</div>
      </div>
      <slot-a><template v-slot:human="{myname}"><em>Here are something in the slot</em></template></slot-a>
    </div>
  `
})

Vue.component('Sow', {
  name: 'Sow',
  data () {
    return {
      sow: '1',
      saw: 'foo'
    }
  },
  template: `<div>Sow <slot name="foo" :sow="sow"></slot> Sow</div>`
})

Vue.component('Fun', {
  functional: true,
  name: 'Fun',
  props: ['bor'],
  render (h, c) {
    console.log(c, c.slots(), c.scopedSlots)
    // in pre vue 2.6, use c.slots().default
    return h('div', c.data, [c.scopedSlots.default(), c.scopedSlots.man({bor:c.props.bor})])
  }
})

/* eslint-disable no-new */
var myvue = new Vue({
  el: '#app',
  // router,
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
    handleClick($event) {console.log($event)}
  },
  // template: `<App class="maee" :message-box="message" link="go" alias="100" />`,
  // template: `<my-tem />`,
  // template: `<V v-model="nut" />`,
  template: `<div>softly <D /></div>`,
  // template: `<Fun :mes="message" :bor="{a: 1}" @click="handleClick">AAA<template v-slot:man="G">MMM{{G.bor.a}}</template></Fun>`,
  // template: `<Sow><template v-slot:foo="G">MMM{{G.sow}}  {{message}}</template></Sow>`,
  // template: `<B @click="handleClick" :msg.sync="message"></B>`,
  // template: `<fn-boy :sel="sel" :bar="message">Hello my boy!<template v-slot:man="G">{{G.bar}}</template></fn-boy>`,
  components: {
    App,
    B,
    V,
    D
  }
}).$mount('#app')