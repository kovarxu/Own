<template>
  <div>
    the following is a username: <slot name="user"></slot><br/>
    the following is a phonenumber: <slot name="phone"></slot>
  </div>
</template>

<script>
export default {
  name: 'TSlot',
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
