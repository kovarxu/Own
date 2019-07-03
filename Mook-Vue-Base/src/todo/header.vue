<template>
  <header class="main-header">
    <h1 v-blue:foo.bar="'blue'">{{ foo }} {{ gooes }}</h1>
  </header>
</template>

<script>
export default {
  name: 'Header',
  // inject 有三种写法
  // inject: ['foo']
  // inject: {foo: 'foo'}
  // inject: {foo: {from: 'foo', default () {return 'bar';}}}
  inject: {
    foo: {
      // from: 'foo', // 不提供也不会报错，vue会使用foo作为from数据来源
      default () {
        return 'bar'
      }
    },
    gooes: {
      from: 'gooes',
      default () {
        return 'no gooes'
      }
    }
  }
}
</script>

<style lang="stylus">
.main-header {
  text-align: center;
  h1 {
    margin: 20px;
    font-size: 60px;
    font-weight: 500;
    color: #ce312f;
  }
}
  
</style>
