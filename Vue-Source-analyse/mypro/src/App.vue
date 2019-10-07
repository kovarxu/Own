<template>
  <div id="app">
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
      bar: 'I am Vue'
    }
  },
  watch: {
    bar (newVal, oldVal) {
      console.log(newVal + ' || The old version is ' + oldVal)
    }
  },
  mounted () {
    console.log(
      'component: app is mounted' + 
      'log img is ready: ', this.$refs.logoImg.complete
      )
    let foo = this.$refs.foo
    console.log(foo.innerHTML)
    this.bar = 'I am Heb'
    console.log(foo.innerHTML)
    this.$nextTick(() => {
      console.log(foo.innerHTML)
    })
    this.$nextTick(() => {
      console.log('----- this is in nextTick ')
    })
    setTimeout(() => {
      console.log('---- this is in setTimeout')
    })

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
