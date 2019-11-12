<template>
  <div>
    <detail />
    <create />
  </div>
</template>

<script>
import Create from './components/create.vue'
import Detail from './components/detail.vue'

export default {
  name: 'App',
  components: {
    Create, Detail
  }
}
</script>