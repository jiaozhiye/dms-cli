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
