/*
 * @Author: 焦质晔
 * @Date: 2020-03-20 10:18:05
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-09 10:32:19
 */
import addEventListener from 'add-dom-event-listener';
import Locale from '../locale/mixin';

export default {
  name: 'FullScreen',
  mixins: [Locale],
  inject: ['$$table'],
  data() {
    return {
      isFull: false
    };
  },
  computed: {
    title() {
      return !this.isFull ? this.t('table.screen.full') : this.t('table.screen.cancelFull');
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
    const iconCls = [
      `iconfont`,
      {
        [`icon-fullscreen`]: !isFull,
        [`icon-fullscreen-exit`]: isFull
      }
    ];
    const cls = [`v-full-screen`, `size--${this.$$table.tableSize}`];
    return (
      <span class={cls} title={title} onClick={this.clickHandle}>
        <i class={iconCls} />
      </span>
    );
  }
};
