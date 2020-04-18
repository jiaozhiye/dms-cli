<template>
  <div class="v-screen-full">
    <SvgIcon class="screenfull-svg" :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'" @click="clickHandle" />
  </div>
</template>

<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-18 21:15:23
 **/
import screenfull from 'screenfull';

export default {
  name: 'ScreenFull',
  data() {
    return {
      isFullscreen: false
    };
  },
  mounted() {
    this.init();
  },
  destroyed() {
    this.destroy();
  },
  methods: {
    clickHandle() {
      if (!screenfull.enabled) {
        return this.$message.warning('浏览器不支持此功能');
      }
      screenfull.toggle();
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen;
    },
    init() {
      if (screenfull.enabled) {
        screenfull.on('change', this.change);
      }
    },
    destroy() {
      if (screenfull.enabled) {
        screenfull.off('change', this.change);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.v-screen-full {
  .screenfull-svg {
    display: inline-block;
    padding: 5px;
    font-size: 18px;
    fill: @textColor;
    cursor: pointer;
  }
}
</style>
