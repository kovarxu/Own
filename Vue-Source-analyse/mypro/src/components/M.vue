<template>
  <div>
    <button @click="vainClick">vain</button>
    <button @click="onShift">Shift</button>
    <keep-alive>
      <compnent :is="comp" :msg="msg" />
    </keep-alive>
  </div>
</template>

<script>
import A from './A.vue'
import B from './B.vue'

export default {
  name: 'M',
  data () {
    return {
      msg: 'I am ok!',
      comp: 'A',
      go: 1
    }
  },
  methods: {
    onShift () {
      this.comp = this.comp === 'A' ? 'B' : 'A'
    },
    vainClick () {
      this.go += 1
      console.log(this.go)
    }
  },
  components: {
    A, B
  }
}
</script>

<style>
  
</style>
