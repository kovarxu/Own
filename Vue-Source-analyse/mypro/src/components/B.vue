<template>
  <div class="hello" @click="_handleMsgChange" @change.native="_handleMsgChange">
    {{ msg }}
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'B',
  data () {
    return {
      bname: 'xxx'
    }
  },
  created () {
    this.$emit('click', 1223434)
    console.log('options', this.$options)
  },
  beforeRouteEnter(to, from, next) {
    console.log('enter B')
    // next('/')
    next()
  },
  methods: {
    _handleMsgChange () {
      this.$emit('update:msg', this.msg + 1)
    }
  },
  props: ['msg']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
