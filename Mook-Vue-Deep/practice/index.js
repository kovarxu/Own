import Vue from 'vue'

const div = document.createElement('div')
document.body.appendChild(div)

new Vue({
  el: div,
  template: '<div>一个人</div>'
})
