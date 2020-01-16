<template>
  <ul @click="onAddNew">
    <li v-for="item in items" v-html="item"></li>
  </ul>
</template>

<script>
export default {
  name: 'A',
  data () {
    return {
      items: [1,2,3]
    }
  },
  methods: {
    onAddNew () {
      this.items.push(Math.random())
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
