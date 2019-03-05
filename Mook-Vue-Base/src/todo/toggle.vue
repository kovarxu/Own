<template>
  <div>
    <div>{{item.title}}<button v-on:click="show = !show">{{text}}</button></div>
    <transition name="ul"
      v-on:before-enter="beforeEnter"
      v-on:enter="enter"
      v-on:leave="leave"
      v-bind:css="false"
    ><div v-if="show" v-html="item.content" style="overflow:hidden;"></div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      eleHeight: 0,
      text: '下'
    };
  },
  props: {
    item: Object,
    containerWidth: Number,
  },
  directives: {
    demo: {
      // bind inserted update componentUpdated unbind
      inserted (el, binding) {
        // el.style.height = '100px';
        el.classList.add('ul-box');
        // el.appendChild(document.creabinding.value || '值不存在');
      },
      unbind (el, binding) {
        // el.style.height = '0';
      }
    }
  },
  methods: {
    beforeEnter (el) {
      // 获取高度
      if (! this.eleHeight) {
        let tmpDiv = document.createElement('div');
        tmpDiv.width = this.containerWidth;
        tmpDiv.appendChild(el.cloneNode(true));
        tmpDiv.style.position = 'absolute';
        tmpDiv.style.left = '-10000px';
        document.body.appendChild(tmpDiv);
        let eleHeight = tmpDiv.clientHeight;
        document.body.removeChild(tmpDiv);
        this.eleHeight = Number(eleHeight);
      }
      
      el.style.height = 0;
    },
    enter (el, done) {
      this.text = '上';
      let frameCount = 0;
      let eleHeight = this.eleHeight;

      const ani = function () {
        let h = Number(el.style.height.match(/\d+/)[0]);
        h += parseFloat(eleHeight / 20);
        el.style.height = h + 'px';
        if (frameCount == 19) {
          cancelAnimationFrame(aniHandler);
          done();
        } else {
          requestAnimationFrame(ani)
          frameCount ++;
        }
      }

      let aniHandler = requestAnimationFrame(ani);
    },
    leave (el, done) {
      this.text = '上';
      let frameCount = 0;
      let eleHeight = this.eleHeight;

      const ani = function () {
        let h = Number(el.style.height.match(/\d+/)[0]);
        h -= parseFloat(eleHeight / 20);
        el.style.height = h + 'px';
        if (frameCount == 19) {
          cancelAnimationFrame(aniHandler);
          done();
        } else {
          requestAnimationFrame(ani)
          frameCount ++;
        }
      }

      let aniHandler = requestAnimationFrame(ani);
    }
  }
};
</script>

<style>

</style>