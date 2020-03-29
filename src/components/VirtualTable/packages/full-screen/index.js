/*
 * @Author: 焦质晔
 * @Date: 2020-03-20 10:18:05
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-29 14:37:59
 */
import addEventListener from 'add-dom-event-listener';

export default {
  name: 'FullScreen',
  inject: ['$$table'],
  data() {
    return {
      isFull: false
    };
  },
  computed: {
    title() {
      return !this.isFull ? '全屏' : '取消全屏';
    }
  },
  methods: {
    clickHandle() {
      this.$$table.isFullScreen = this.isFull = !this.isFull;
    },
    keyboardHandle(ev) {
      if (!this.isFull) return;
      // Esc 取消
      if (ev.keyCode === 27) {
        this.$$table.isFullScreen = this.isFull = false;
      }
    }
  },
  mounted() {
    this.event = addEventListener(document, 'keydown', this.keyboardHandle);
  },
  destroyed() {
    this.event.remove();
  },
  render() {
    const { isFull, title } = this;
    const cls = [
      `iconfont`,
      {
        [`icon-fullscreen`]: !isFull,
        [`icon-fullscreen-exit`]: isFull
      }
    ];
    return (
      <span class="v-full-screen" title={title} onClick={this.clickHandle}>
        <i class={cls} style="font-size: 18px; margin-top: 1px;" />
      </span>
    );
  }
};
