<template>
  <div>
    <book-info @msg="onHandleMsg" />
    <passage :title="title" :contents="contents" />
    <err-tips :errMsg="errmsg" @hideTips="onHideTips" />
  </div>
</template>

<script>
import BookInfo from './component/bookinfo.vue'
import Passage from './component/passage.vue'
import ErrTips from './component/errTips.vue'
import fake from './utils/fake'

export default {
  name: 'App',
  data () {
    return {
      errmsg: '',
      title: fake.title,
      contents: fake.contents
    }
  },
  components: {
    BookInfo,
    ErrTips,
    Passage
  },
  methods: {
    onHandleMsg (msg) {
      this.errmsg = msg
    },
    onHideTips () {
      this.errmsg = ''
    }
  }
}
</script>

<style lang="scss">

</style>