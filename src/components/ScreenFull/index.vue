<template>
  <div class="screen-full">
    <SvgIcon
      class="screenfull-svg"
      :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
      @click="clickHandle"
    />
  </div>
</template>

<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 10:00:00
 **/
import screenfull from 'screenfull';

export default {
  name: 'ScreenFull',
  data() {
    return {
      isFullscreen: false
    };
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
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.destroy();
  }
};
</script>

<style lang="less" scoped>
.screen-full {
  .screenfull-svg {
    display: inline-block;
    padding: 5px;
    font-size: 18px;
    fill: @textColor;
    cursor: pointer;
  }
}
</style>
