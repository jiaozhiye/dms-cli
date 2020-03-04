<template>
  <div class="drawer">
    <div :class="['cover-mask', maskShow]" :style="[maskzIndex, maskStyle]" @click.stop="close('mask')" />
    <div ref="panel" :class="['cover-container']" :style="[containerPosition, containerShow, containerzIndex, containerStyle]">
      <div class="drawer-content">
        <div class="drawer-header">
          <div class="drawer-title">
            <slot name="title">{{ title }}</slot>
          </div>
          <button v-if="closable" class="drawer-close" @click.stop="close()">
            <span class="drawer-close-x">
              <i class="anticon anticon-close">
                <svg viewBox="64 64 896 896" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true" class>
                  <path
                    d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"
                  />
                </svg>
              </i>
            </span>
          </button>
        </div>
        <div class="drawer-body">
          <Spin v-if="loading" :spinning="loading" tip="Loading..." :containerStyle="{ height: 'calc(100vh - 140px)' }" />
          <slot v-if="isVisible" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-04 11:44:32
 **/
import Spin from '@/components/Spin/Spin';

export default {
  name: '',
  components: {
    Spin
  },
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
    maskShow() {
      return this.visible ? 'mask-show' : '';
    },
    containerPosition() {
      return this.STYLE[this.position];
    },
    containerShow() {
      const style = {
        visibility: 'visible',
        transform: `translate3d(0, 0, 0)`
      };
      return this.visible ? style : '';
    },
    maskzIndex() {
      return { zIndex: this.zIndex };
    },
    containerzIndex() {
      return { zIndex: this.zIndex + 1 };
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
  beforeDestroy() {
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
      // 防止多次触发
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
  }
};
</script>

<style lang="less" scoped>
.drawer {
  .cover-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.65);
    visibility: hidden;
    transition: all 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
    transform-origin: 50% 50% 0px;
    opacity: 0;
  }
  .mask-show {
    visibility: visible;
    opacity: 0.3;
  }
  .cover-container {
    position: fixed;
    visibility: hidden;
    background-color: rgb(255, 255, 255);
    transition: all 0.3s cubic-bezier(0.9, 0, 0.3, 0.7);
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
    .drawer-content {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      .drawer-header {
        position: relative;
        padding: 16px 20px;
        border-radius: 4px 4px 0 0;
        background: #fff;
        color: rgba(0, 0, 0, 0.65);
        border-bottom: 1px solid @borderColor;
        .drawer-title {
          margin: 0;
          font-size: 16px;
          line-height: 22px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.65);
        }
        .drawer-close {
          cursor: pointer;
          border: 0;
          background: transparent;
          position: absolute;
          right: 0;
          top: 0;
          z-index: 10;
          font-weight: 700;
          line-height: 1;
          text-decoration: none;
          transition: color 0.3s;
          color: rgba(0, 0, 0, 0.45);
          outline: 0;
          padding: 0;
          &:hover {
            color: @primaryColor;
            text-decoration: none;
          }
          .drawer-close-x {
            display: block;
            font-style: normal;
            text-align: center;
            text-transform: none;
            text-rendering: auto;
            width: 55px;
            height: 55px;
            line-height: 55px;
            font-size: 16px;
          }
        }
      }
      .drawer-body {
        padding: 10px 20px;
        word-wrap: break-word;
      }
    }
  }
  .anticon {
    display: inline-block;
    font-style: normal;
    vertical-align: -0.125em;
    text-align: center;
    text-transform: none;
    line-height: 0;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }
}
</style>
