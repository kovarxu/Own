<template>
  <div class="row">
    <div id="info.id" class="item">
      <div class="item-title">{{ info.name }}</div>
      <div class="item-content">
        <div class="content-left" :id="'res_' + info.id">
          <div class="handler" v-for="(item,index) in info.res" :key="index">{{ item.name }}</div>
        </div>
        <div class="content-right" :id="'rej_' + info.id">
          <div class="handler" v-for="(item,index) in info.rej" :key="index">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PromiseItem',
  props: {
    info: {
      type: Object,
      default() {return {}}
    }
  }
}
</script>

<style>
.row {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 240px;
}

.item {
  width: 160px;
  padding-top: 30px;
  padding-bottom: 30px;
  background-color: #6495ed;
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
  height: 20px;
  margin-top: 1px;
  text-align: center;
  border-radius: 2px;
  cursor: pointer;
  background: #ec6612;
}
</style>
