<template>
  <div class="input-area">
    <textarea class="textarea" cols="50" rows="20" v-model="content"></textarea>
    <a href="javascript:;" role="button" class="btn" @click="onParse">Parse</a>
  </div>
</template>

<script>
export default {
  name: 'InputArea',
  data () {
    return {
      content: ''
    }
  },
  methods: {
    onParse () {
      this.$emit('parse', this.content)
    }
  }
}
</script>

<style>
.input-area {
  max-width: 500px;
}
.input-area .textarea {
  display: block;
  height: 200px;
  margin-bottom: 20px;
}
.input-area .btn {
  padding: 10px 30px;
  border-radius: 6px;
  text-decoration: none;
  background-color: #ec32ec;
  color: #fff;
}
</style>