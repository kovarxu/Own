<template>
  <div>
    <slot :items="items"></slot>
  </div>
</template>

<script>
export default {
  name: 'TScoped',
  data () {
    return {
      items: [
        'A', 'B', 'C'
      ]
    }
  },
  mounted () {

  },
  methods: {

  }
}
</script>

<style lang="stylus">
  
</style>
