<template>
  <div class="container">
    <input-area @parse="parse" />
    <div class="diagram-container">
    </div>
  </div>
</template>

<script>
import PromiseItem from './components/item.vue'
import InputArea from './components/input.vue'
const parse = require('proParser')

export default {
  name: 'App',
  data () {
    return {

    }
  },
  methods: {
    parse(content) {
      console.log('start mission.', content, parse)
      parse(content)
    }
  },
  components: {
    PromiseItem,
    InputArea
  }
}
</script>

<style>
.container {
  width: 1000px;
  margin: auto;
}
.diagram-container {
  padding: 20px;
  height: 700px;
  /* display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: start; */
}
</style>