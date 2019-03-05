<template>
  <div id="app">
    <div id="cover"></div>
    <Header></Header>
    <Todo></Todo>
    <Footer></Footer>
    <Toggle v-for="item in items" :item="item" :container-width="containerWidth"></Toggle>
  </div>
</template>

<script>
import Header from './todo/header.vue'
import Footer from './todo/footer.jsx'
import Todo from './todo/todo.vue'
import Toggle from './todo/toggle.vue'

export default {
  components: {
    Header,
    Footer,
    Todo,
    Toggle,
  },
  data () {
    return {
      containerWidth: 0,
      items: [
        {
          id: 12,
          title: '讲的水电费水电费',
          content: '<p>讲的什么垃圾</p><p>讲的什么垃圾</p><p>讲的什么垃圾</p><p>讲的什么垃圾</p><p>讲的什么垃圾</p><p>讲的什么垃圾</p>',
        },
        {
          id: 13,
          title: '将的有时什么史蒂夫',
          content: '<p>讲的什么垃圾</p><p>讲的什么垃圾</p><p>讲的什么垃圾</p><p>讲的什么垃圾</p><p>讲的什么垃圾</p><p>讲的什么垃圾</p><p>讲的什么垃圾</p><p>讲的什么垃圾</p><p>讲的什么垃圾</p><p>讲的什么垃圾</p><p>讲的什么垃圾</p><p>讲的什么垃圾</p>',
        },
        {
          id: 16,
          title: '将的有时什么史蒂夫',
          content: '<p>讲的什么垃圾</p><p>讲的什么垃圾</p><p>讲的什么垃圾</p><p>讲的什么垃圾</p><p>讲的什么垃圾</p><p>讲的什么垃圾</p><p>讲的什么垃圾</p><p>讲的什么垃圾</p><p>讲的什么垃圾</p><p>讲的什么垃圾</p><p>讲的什么垃圾</p><p>讲的什么垃圾</p><p>讲的什么垃圾</p><p>讲的什么垃圾</p><p>讲的什么垃圾</p><p>讲的什么垃圾</p><p>讲的什么垃圾</p><p>讲的什么垃圾</p>',
        }
      ]
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.containerWidth = window.outerWidth;
    })
  },
}
</script>

<style scoped lang="stylus">
  #cover {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background-color: #999;
    opacity: .9;
    z-index: -1;
  }
</style>
