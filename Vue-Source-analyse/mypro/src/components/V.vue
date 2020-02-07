<template>
  <div>
    <input type="checkbox" name="f" :checked="coco === 1" @click="$emit('mycheck', 2)" /> bootball
    <input type="checkbox" name="f" :checked="coco === 2" @click="$emit('mycheck', 3)" /> basketball
    <input type="checkbox" name="f" :checked="coco === 3" @click="$emit('mycheck', 1)" /> volleyball
  </div>
</template>

<script>
export default {
  name: 'V',
  model: {
    prop: 'coco',
    event: 'mycheck'
  },
  props: ['coco']
}
</script>

<style lang="">
  
</style>