<template>
  <div :id="'pid_' + info.id" class="item" 
    :style="{'background-color': themeColor, 'cursor': info.head ? 'pointer' : 'inherit'}"
    @click="info.head && onShowBodyInfo(info.handler)"
  >
    <div class="item-title">{{ info.realm || 'anonymous' }}</div>
    <div class="item-content" v-if="!info.head">
      <div class="content-left" :id="'res_' + info.id">
        <div class="handler" v-for="(item,index) in info.res" :key="index" @click="onShowBodyInfo(item)">{{ 'res' + index }}</div>
      </div>
      <div class="content-right" :id="'rej_' + info.id">
        <div class="handler" v-for="(item,index) in info.rej" :key="index" @click="onShowBodyInfo(item)">{{ 'rej' + index }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getThemeColor } from '../utils/helper.js'

export default {
  name: 'PromiseItem',
  data () {
    return {
      themeColor: getThemeColor(this.info.realm)
    }
  },
  methods: {
    onShowBodyInfo (obj) {
      this.$emit('show-body-info', obj)
    }
  },
  props: {
    info: {
      type: Object,
      default() { return {} }
    }
  }
}
</script>

<style>
.item {
  width: 160px;
  padding-top: 30px;
  padding-bottom: 30px;
  color: #fff;
  border-radius: 3px;
  margin-right: 60px;
}
.item:last-child {
  margin-right: 0;
}

.item-title {
  text-align: center;
  margin-bottom: 20px;
}
.item-content {
  overflow: hidden;
  width: 60%;
  margin: auto;
}
.item-content>div {
  float: left;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-end;
  width: 40%;
  min-height: 60px;
  margin-right: 20%;
  background: #fff;
  border-radius: 2px;
}
.item-content>div:last-child {
  margin-right: 0;
}
.item-content .handler {
  width: 100%;
  margin-top: 1px;
  text-align: center;
  border-radius: 2px;
  cursor: pointer;
  background: #ec6612;
  line-height: 20px;
  font-size: 10px;
}
</style>
