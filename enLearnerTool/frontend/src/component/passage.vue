<template>
  <div class="passage-container">
    <h2 class="title">{{ title }}</h2>
    <div class="paragraphs">
      <template v-for="(per, index) of cList">
        <span class="para" :key="'_per_' + index" @touchstart="onTouch(per)" @touchend="onCancelTouch">{{ per }}</span>&nbsp;
      </template>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Passage',
  data () {
    return {
      isTouching: false,
      touchHandler: null
    }
  },
  computed: {
    cList () {
      return this.contents.split(/[\s:,\.?;]+/)
    }
  },
  methods: {
    onTouch (word) {
      this.isTouching = true
      this.touchHandler = setTimeout(() => {
        this.search(word)
      }, 240)
    },
    onCancelTouch () {
      if (this.isTouching) {
        this.isTouching = false
        clearTimeout(this.touchHandler)
      }
    },
    search (word) {
      axios.get('http://127.0.0.1:8881/search?word=' + word).then(data => {
        console.log(data)
      }).catch(e => {
        console.log('error', e)
      })
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    contents: {
      type: String,
      default () {
        return ''
      }
    }
  }
}
</script>

<style lang="scss">
.passage-container {
  margin: 1rem 1.2rem;
}
.title {
  font-weight: normal;
  color: #333;
  text-align: left;
  line-height: 2;
  font-size: 2.2rem;
}
.para {
  color: #666;
  font-size: 1.8rem;
}
</style>
