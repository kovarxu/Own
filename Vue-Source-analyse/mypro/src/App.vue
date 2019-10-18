<template>
  <div id="app">
    <div v-if="hasInited">Inited</div>
    <span v-else>Loading</span>
    <img src="./assets/logo.png" ref="logoImg">
    <div v-graybg:good="123" ref="foo">{{ bar }}</div>
    <div>{{ messageBox }}</div>
  </div>
</template>

<script>
export default {
  name: 'App',
  props: ['message-box'],
  data () {
    return {
      bar: 'I am Vue',
      db: {
        a: 1,
        b: 2,
        c: ['a','b']
      },
      nl: [1,2,3],
      hasInited: false
    }
  },
  computed: {
    cbox () {
      return this.bar.substr(0, 4)
    },
    c_obj () {
      return this.d_obj
    }
  },
  watch: {
    bar (newVal, oldVal) {
      console.log(newVal + ' || The old version is ' + oldVal)
    },
    db: {
      deep: true,
      handler: function (val, oldval) {
        console.log('db updated: ', val, oldval)
      }
    },
    nl (newVal, oldVal) {
      console.log('nl updated: ', newVal, oldVal)
    }
  },
  mounted () {
    // console.log(
    //   'component: app is mounted' + 
    //   'log img is ready: ', this.$refs.logoImg.complete
    //   )
    // let foo = this.$refs.foo
    // console.log(foo.innerHTML)
    // this.bar = 'I am Heb'
    // console.log(foo.innerHTML)
    // this.$nextTick(() => {
    //   console.log(foo.innerHTML)
    // })
    // this.$nextTick(() => {
    //   console.log('----- this is in nextTick ')
    // })
    setTimeout(() => {
      this.hasInited = true
      console.log('---- this is in setTimeout')
    })
    this.bar = 'xxxyyyzzz'
    console.log('cbox', this.cbox)

    this.db.c.pop()

    this.nl.pop()
  },
  methods: {
    fee () {
      console.log('wang!')
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
