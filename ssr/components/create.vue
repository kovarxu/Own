<template>
  <form>
    <p>
      {{ intro }}
    </p>
    <p>
      name: <input type="text">
    </p>
    <p>
      id: <input type="number">
    </p>
    <p>
      occupation: <input type="text">
    </p>
    <p>
      remark: <input type="text">
    </p>
  </form>
</template>

<script>
export default {
  name: 'Create',
  data () {
    return {
      intro: 'Hear is a default introduction'
    }
  }
}
</script>