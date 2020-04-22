<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-22 19:23:43
 **/
import Spin from '@/components/Spin';

export default {
  name: 'VDrawer',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    closable: {
      type: Boolean,
      default: true
    },
    destroyOnClose: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '标题'
    },
    position: {
      type: String,
      default: 'right'
    },
    lockScroll: {
      type: Boolean,
      default: true
    },
    maskClosable: {
      type: Boolean,
      default: false
    },
    width: {
      type: [Number, String],
      default: '72%'
    },
    height: {
      type: [Number, String],
      default: 300
    },
    zIndex: {
      type: Number,
      default: 100
    },
    maskStyle: {
      type: Object,
      default: () => ({})
    },
    containerStyle: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    this.STYLE = {
      bottom: {
        bottom: 0,
        left: 0,
        width: '100%',
        minHeight: this.calcPanelSize(this.height),
        transform: 'translate3d(0, 100%, 0)'
      },
      left: {
        bottom: 0,
        left: 0,
        width: this.calcPanelSize(this.width),
        minWidth: '800px',
        height: '100vh',
        transform: 'translate3d(-100%, 0, 0)'
      },
      top: {
        top: 0,
        right: 0,
        width: '100%',
        minHeight: this.calcPanelSize(this.height),
        transform: 'translate3d(0, -100%, 0)'
      },
      right: {
        top: 0,
        right: 0,
        width: this.calcPanelSize(this.width),
        minWidth: '800px',
        height: '100vh',
        transform: 'translate3d(100%, 0, 0)'
      }
    };
    this.drawerDom = null;
    this.transitionFlag = true;
    return {
      isVisible: this.visible,
      loading: this.visible
    };
  },
  computed: {
    delayTime() {
      return !this.isIE() ? 300 : 400;
    },
    containerPosition() {
      return this.STYLE[this.position];
    },
    containerShow() {
      const style = {
        visibility: 'visible',
        transform: `translate3d(0, 0, 0)`
      };
      return this.visible ? style : null;
    }
  },
  watch: {
    visible(val) {
      if (val) {
        if (this.destroyOnClose || !this.isVisible) {
          this.loading = val;
        }
        setTimeout(() => {
          this.isVisible = val;
          this.loading = !val;
        }, this.delayTime);
      }
      this.transitionFlag = true;
      this.$emit(val ? 'open' : 'close');
      if (this.lockScroll) {
        document.body.style.overflow = val ? 'hidden' : '';
      }
    }
  },
  mounted() {
    this.drawerDom = this.$refs.panel;
    this.drawerDom.addEventListener('transitionend', this.transitionendHandle, false);
  },
  destroyed() {
    this.drawerDom.removeEventListener('transitionend', this.transitionendHandle);
  },
  methods: {
    open() {
      this.$emit('update:visible', true);
    },
    close(from) {
      if (from === 'mask' && !this.maskClosable) return;
      this.$emit('update:visible', false);
    },
    calcPanelSize(val) {
      return Number(val) > 0 ? `${val}px` : val;
    },
    transitionendHandle(ev) {
      if (ev.target !== ev.currentTarget || !this.transitionFlag) return;
      this.transitionFlag = false;
      if (!this.visible && this.destroyOnClose) {
        this.isVisible = false;
      }
      this.$emit('afterVisibleChange', this.visible);
    },
    isIE() {
      return !!window.ActiveXObject || 'ActiveXObject' in window;
    }
  },
  render() {
    const { isVisible, loading, closable, title, zIndex, maskStyle, containerPosition, containerShow, containerStyle, $slots } = this;
    const cls = [
      'drawer-mask',
      {
        [`mask-show`]: this.visible
      }
    ];
    return (
      <div class="v-drawer--wrapper">
        <div class={cls} style={{ ...maskStyle, zIndex }} onClick={() => this.close('mask')} />
        <div ref="panel" class="drawer-container" style={{ ...containerPosition, ...containerShow, ...containerStyle, zIndex: zIndex + 1 }}>
          <div class="header">
            <div class="title">{$slots[`title`] || title}</div>
            {closable && (
              <span class="close" title="关闭" onClick={this.close}>
                <i class="iconfont icon-close" />
              </span>
            )}
          </div>
          <div class="container">
            {isVisible && $slots[`default`]}
            {loading && (
              <div class="loading">
                <Spin spinning={loading} tip="Loading..." />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};
</script>

<style lang="less" scoped>
.v-drawer--wrapper {
  .drawer-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.45);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
    transform-origin: 50% 50% 0;
  }
  .mask-show {
    opacity: 1;
    visibility: visible;
  }
  .drawer-container {
    position: fixed;
    visibility: hidden;
    background-color: #fff;
    transition: all 0.3s cubic-bezier(0.9, 0, 0.3, 0.7);
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
    .header {
      display: flex;
      align-items: center;
      position: relative;
      height: 48px;
      padding: 0 15px;
      box-sizing: border-box;
      border-bottom: 1px solid @borderColor;
      border-radius: @borderRadius @borderRadius 0 0;
      .title {
        font-size: 16px;
      }
      .close {
        position: absolute;
        padding: 5px;
        right: 10px;
        top: 10px;
        color: @textColorSecondary;
        line-height: 1;
        cursor: pointer;
        transition: color 0.3s ease;
        &:hover {
          color: @primaryColor;
          text-decoration: none;
        }
        i {
          font-size: 18px;
        }
      }
    }
    .container {
      height: calc(100% - 48px);
      padding: 10px 15px;
      overflow-y: auto;
      box-sizing: border-box;
      .loading {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
