import { createApp, ref, computed } from 'vue';
import App from './App.vue'

createApp(App).mount('#app')

let obj = {
  a: 3,
  b: '33',
  c: [1,2,3]
}

let k = ref(obj)

console.log(obj, k)

let d = computed({
  get() {
    return obj.b + ' computed'
  },
  set(value) {
    obj.b = value
  }
})

console.log(d)

obj.b = '55'

console.log(d)

d.value = 999

console.log(obj)
