<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-09 10:17:52
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
    init() {
      if (screenfull.enabled) {
        screenfull.on('change', this.change);
      }
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen;
    },
    clickHandle() {
      screenfull.toggle();
    },
    destroy() {
      if (screenfull.enabled) {
        screenfull.off('change', this.change);
      }
    }
  },
  render() {
    const cls = [`iconfont`, this.isFullscreen ? `icon-fullscreen-exit` : `icon-fullscreen`];
    return (
      <div class="v-screen-full" onClick={this.clickHandle}>
        <i class={cls} />
      </div>
    );
  }
};
</script>

<style lang="scss" scoped>
.v-screen-full {
  display: flex;
  width: 26px;
  height: 26px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  i {
    font-size: 20px;
    font-weight: 700;
  }
}
</style>
