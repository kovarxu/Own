<template>
  <div class="content-input">
    <div class="uinfo_tit">输入标题：</div>
    <input type="text" v-model="title" class="uinfo_input" placeholder="" value="">
    <div class="uinfo_tit">输入文章内容：</div>
    <textarea v-model="content" class="content-textarea" name="passageContent"></textarea>
    <div class="confirm" @click="onSubmitBookInfo">确定</div>
  </div>
</template>

<script>
export default {
  name: 'BookInfo',
  data () {
    return {
      title: '',
      content: '',
      errmsg: ''
    }
  },
  methods: {
    onSubmitBookInfo () {
      // if (!this._handleData()) return 
      // todo
      
    },
    _handleData () {
      this.title = this.title.trim()
      this.content = this.content.trim()
      if (this.title === '') {
        this.errmsg = '请输入标题'
        this.$emit('msg', this.errmsg)
        return false
      }
      if (this.content === '') {
        this.errmsg = '请输入内容'
        this.$emit('msg', this.errmsg)
        return false
      }
    }
  }
}
</script>

<style lang="scss">
.content-input {
  margin: 1rem 1.2rem;
}
.uinfo_tit {
  color: #333;
  text-align: left;
  line-height: 2.8rem;
}
.uinfo_input {
  height: 2.8rem;
  border: 1px solid #D4D4D4;
  padding: 0 .5rem;
  width: 35rem;
}
.content-textarea {
  appearance: none;
  outline: none;
  border: 1px solid #999;
  display: block;
  width: 35rem;
  height: 10rem;
  color: #333;
}
.confirm {
  line-height: 3.4rem;
  margin-top: 1rem;
  border-radius: 3px;
  color: #fff;
  background-color: rgb(169, 39, 56);
  text-align: center;
}
</style>