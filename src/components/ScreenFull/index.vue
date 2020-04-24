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
 * @Last Modified time: 2020-04-24 12:50:10
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

<style lang="scss" scoped>
.v-screen-full {
  /deep/ .screenfull-svg {
    display: inline-block;
    width: 20px;
    height: 20px;
    padding: 5px;
    fill: $textColor;
    cursor: pointer;
  }
}
</style>
