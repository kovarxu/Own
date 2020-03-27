<template>
  <div>
    <ul>
      <li v-for="item in coco">{{ item }}</li>
    </ul>
    <input type="text" @keyup="handelKickIn" />
  </div>
</template>

<script>
// <input type="checkbox" name="f" :checked="coco === 1" @click="$emit('mycheck', 2)" /> bootball
// <input type="checkbox" name="f" :checked="coco === 2" @click="$emit('mycheck', 3)" /> basketball
// <input type="checkbox" name="f" :checked="coco === 3" @click="$emit('mycheck', 1)" /> volleyball
import deepCopy from '../assets/deepcopy.js'

export default {
  name: 'V',
  model: {
    prop: 'coco',
    event: 'mycheck'
  },
  methods: {
    handelKickIn ($event) {
      let key = $event.keyCode
      console.log(key)
      if (key === 13) {
        let mc = deepCopy(this.coco)
        mc.push($event.target.value)
        this.$emit('mycheck', mc)
      }
    }
  },
  props: ['coco']
}
</script>

<style lang="">
  
</style>