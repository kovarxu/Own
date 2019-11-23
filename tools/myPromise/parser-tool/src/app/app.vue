<template>
  <div class="container">
    <input-area @parse="parse" />
    <div class="diagram-container">
      <div class="row" v-for="(list,index) in layerData" :key="index">
        <promise-item v-for="info in list" :key="info.id" :info="info" @show-body-info="showDetail" />
      </div>
      <detail-info ref="detail" :info="curPointInfo" />
    </div>
  </div>
</template>

<script>
import PromiseItem from './components/item.vue'
import InputArea from './components/input.vue'
import DetailInfo from './components/detail.vue'
import { convert, link, clearThemeMap } from './utils/helper.js'
const parse = require('proParser')

export default {
  name: 'App',
  data () {
    return {
      layerData: [],
      curPointInfo: {}
    }
  },
  methods: {
    parse(content) {
      console.log('start mission.')
      let results = parse(content), layers
      console.log(results)
      if (results) {
        clearThemeMap()
        layers = convert(results)
        console.log(layers)
      }

      // we can only support one root promise element now
      let key = Object.keys(layers)[0]
      if (key) {
        this.layerData = layers[key]
        this.$nextTick(() => {
          link(this.layerData)
        })
      }
    },
    showDetail(obj) {
      if (obj === null) {
        this.curPointInfo = { isnull: true }
      } else {
        this.curPointInfo = JSON.parse(JSON.stringify(obj))
      }
      this.$refs.detail.show()
    }
  },
  components: {
    PromiseItem,
    InputArea,
    DetailInfo
  }
}
</script>

<style>
.container {
  width: 1120px;
  margin: auto;
  display: flex;
  justify-content: center;
}
.diagram-container {
  position: relative;
  padding: 20px;
  height: 700px;
  flex: 1;
  /* display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: start; */
}
.row {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-bottom: 65px;
}
</style>