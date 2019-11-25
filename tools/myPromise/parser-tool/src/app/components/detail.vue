<template>
  <div class="info-detail" v-show="isShow">
    <div class="close" @click="hide">x</div>
    <div v-if="info.isnull" class="null-show">null</div>
    <ul v-else class="detail-list">
      <li>
        <div class="item-name">name:</div>
        <div class="item-value">{{ info.name }}</div>
      </li>
      <li>
        <div class="item-name">parameters:</div>
        <div class="item-value">{{ info.parameters }}</div>
      </li>
      <li>
        <div class="item-name">body:</div>
        <div class="item-value">{{ info.body }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'DetailInfo',
  data () {
    return {
      isShow: false,
    }
  },
  methods: {
    show () {
      this.isShow = true
    },
    hide () {
      this.isShow = false
    }
  },
  props: {
    info: {
      type: Object,
      default () {
        return {}
      }
    }
  }
}
</script>

<style>
.close {
  position: relative;
  color: #fff;
  font-size: 22px;
  float: right;
  top: -2px;
  right: 15px;
  cursor: pointer;
}
.info-detail {
  width: 280px;
  border-radius: 6px;
  position: fixed;
  z-index: 8;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  top: 100px;
  margin-left: 530px;
}
.detail-list {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.detail-list>li {
  margin-bottom: 10px;
}
.item-name {
  color: #ccc;
}
.null-show {
  line-height: 50px;
  font-size: 20px;
  margin-left: 20px;
}
</style>
