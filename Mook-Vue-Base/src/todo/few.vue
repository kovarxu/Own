<template>
  <section>
    <h3 class="name">{{ info.name }}</h3>
    <div class="love-container">
      <p v-for="(o, k) of info.loveRates" :key="'_loverate_' + k">{{ k }}: {{ o }}</p>
    </div>
    <address>{{ info.address }}</address>
  </section>
</template>

<script>
export default {
  name: 'Few',
  data () {
    return {
      info: (function () {
        let tmp = {
          name: 'Rousould Miccson',
          address: 'Mountain Goo'
        }
        Object.defineProperty(tmp, 'loveRates', {
          configurable: false,
          enumerable: true,
          writable: true,
          value: {
            sing: 1,
            walk: 4,
            soccer: 3
          }
        })
        return tmp
      }()),
      foo: {
        a: 1,
        b: 2
      }
    }
  },
  watch: {
    'info.name': function (newVal, oldVal) {
      console.log(newVal, oldVal)
    },
    'info.loveRates': {
      deep: true,
      handler: function (newVal, oldVal) {
        console.log(newVal, oldVal)
      }
    },
    foo: {
      deep: true,
      handler: function (newVal, oldVal) {
        console.log(newVal, oldVal)
      }
    },
  },
  mounted () {
    console.log(this)
    console.log(Object.getOwnPropertyDescriptors(this.$data.info))
    this.info.name = 'Jocky'
    this.info.loveRates.sing = 3
    this.foo.a = 3
  }
}
</script>

<style lang="stylus">
  
</style>