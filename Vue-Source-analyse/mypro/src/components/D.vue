<template>
  <div>
    <button @click="onShift">Shift</button>
    <div>{{ seats }}</div>
    <slot :car="car">I am foo</slot>
  </div>
</template>

<script>
export default {
  name: 'D',
  data () {
    return {
      foo: 1,
      bar: '2',
      car: {
        seats: 2,
        price: [100, 200, 300]
      }
    }
  },
  computed: {
    seats () {
      // debugger
      return this.car.seats
    }
  },
  methods: {
    onShift () {
      debugger
      this.car.seats += 1
    }
  }
}
</script>

<style>
  
</style>
