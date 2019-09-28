<template>
  <div id="app">
    <img src="./assets/logo.png" ref="logoImg">
    <div>I am vue</div>
    <div>{{ messageBox }}</div>
  </div>
</template>

<script>
export default {
  name: 'App',
  props: ['message-box'],
  mounted () {
    console.log(
      'component: app is mounted' + 
      'log img is ready: ', this.$refs.logoImg.complete
      )
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
