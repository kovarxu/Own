<template>
  <div class="hello">
    {{ msg }}
  </div>
</template>

<script>
export default {
  name: 'B',
  data () {
    return {
      msg: 'B'
    }
  },
  beforeRouteEnter(to, from, next) {
    console.log('enter B')
    next('/')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
