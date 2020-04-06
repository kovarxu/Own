<template>
  <div>
    <ul>
      <li v-for="item in info">
        <h3>{{item.title}}</h3>
        <p>{{item.desc}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Sobj',
  props: {
    info: {
      type: Array,
      default: []
    }
  }
}
</script>

