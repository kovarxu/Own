import Vue from 'vue'
import router from './router'
import App from './App.vue'
import B from './components/B.vue'
import V from './components/V.vue'
import D from './components/D.vue'
import F from './components/f.js'
<<<<<<< HEAD
import S from './components/S.vue'
=======
<<<<<<< HEAD

// console.log('M ', M)
=======
>>>>>>> b968e8a47c1442e244cd01ed72cebba2c207fb02
// import myFoo from './ok.js'
// console.log('foo ' + myFoo)
>>>>>>> 90f6c0f6a83eea438bc90688096be9f67f274023

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
<<<<<<< HEAD
      nut: 1,
      info: [
        {title: 'title1', desc: 'a bunch of things'},
        {title: 'title2'}
      ]
=======
      nut: [112,23,34],
>>>>>>> b968e8a47c1442e244cd01ed72cebba2c207fb02
    }
  },
  mounted () {
    console.log('root component has mounted')
  },
  methods: {
    addAttrByAssign () {
      this.info[1].desc = 'a box of apple'
    },
    addAttrBySet () {
      this.$set(this.info[1], 'desc', 'a box of pear')
    }
  },
  template: `<div>
               <button @click="addAttrByAssign">Assign</button>
               <button @click="addAttrBySet">Set</button>
               <S :info="info" />
             </div>`,
  // template: `<App class="maee" :message-box="message" link="go" alias="100" />`,
  // template: `<my-tem />`,
<<<<<<< HEAD
  template: `<V v-model="nut" />`,
  // template: `<div>softly <D /></div>`,
=======
  // template: `<V v-model="nut" />`,
  // template: `<div>softly <D /></div>`,
  // template: `<sl>
  //             <div>
  //               <p>my table</p>
  //               <p>my chair</p>
  //               <p>my bed</p>
  //             </div>

  //             <template v-slot:floor="p">
  //               <p>{{ p.patterns[1] }}</p>
  //             </template>

  //             <D v-slot="pl">
  //               {{ pl.car }}
  //             </D>

  //             <template slot="basement">
  //               I am a new basement
  //             </template>

<<<<<<< HEAD
  //             <router-view name="default" />
  //           </sl>`,
=======
              <router-view name="default" />
            </sl>`,
>>>>>>> 90f6c0f6a83eea438bc90688096be9f67f274023
>>>>>>> b968e8a47c1442e244cd01ed72cebba2c207fb02
  // template: `<Fun :mes="message" :bor="{a: 1}" @click="handleClick">AAA<template v-slot:man="G">MMM{{G.bor.a}}</template></Fun>`,
  // template: `<Sow><template v-slot:foo="G">MMM{{G.sow}}  {{message}}</template></Sow>`,
  // template: `<B @click="handleClick" :msg.sync="message"></B>`,
  // template: `<fn-boy :sel="sel" :bar="message">Hello my boy!<template v-slot:man="G">{{G.bar}}</template></fn-boy>`,
  components: {
    // App,
    // B,
    // V,
    D,
    S
  }
}).$mount('#app')