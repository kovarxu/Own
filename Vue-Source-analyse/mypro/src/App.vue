<template>
  <div id="app">
    <div v-if="hasInited">Inited</div>
    <span v-else>Loading</span>
    <div ref="foo">{{ bar | fli('a', 'b') }}</div>
    <router-view />
  </div>
</template>
``
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
  filters:{
    fli (target, a, b) {
      return target + a + b
    }
  },
  computed: {
    cbox () {
      return this.bar.substr(0, 4)
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
    console.log('db', this)
    console.log('----------------------------')
    console.log(this.$route)
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
