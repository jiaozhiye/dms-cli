/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-07 21:09:16
 **/
import PropTypes from '../_utils/vue-types';
import { getConfig } from '../_utils/globle-config';
import { isIE } from '../_utils/tool';
import Spin from '../Spin';
import Size from '../_utils/mixins/size';
import Locale from '../_utils/mixins/locale';
import PrefixCls from '../_utils/mixins/prefix-cls';

export default {
  name: 'VDrawer',
  mixins: [Locale, Size, PrefixCls],
  props: {
    visible: PropTypes.bool.def(false),
    size: PropTypes.oneOf(['small', 'default', 'large']),
    closable: PropTypes.bool.def(true),
    destroyOnClose: PropTypes.bool.def(false),
    title: PropTypes.string.def(''),
    position: PropTypes.string.def('right'),
    lockScroll: PropTypes.bool.def(true),
    maskClosable: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def('75%'),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def('300px'),
    level: PropTypes.number.def(1),
    zIndex: PropTypes.number.def(100),
    maskStyle: PropTypes.object.def({}),
    containerStyle: PropTypes.object.def({})
  },
  provide() {
    return { $$drawer: this };
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
    this.transitionFlag = true;
    return {
      isVisible: this.visible,
      loading: this.visible
    };
  },
  computed: {
    $$drawerPanel() {
      return this.$refs.panel;
    },
    realzIndex() {
      return Number(this.zIndex) + Number(this.level);
    },
    delayTime() {
      return !isIE() ? 300 : 400;
    },
    maskToClose() {
      return this.maskClosable ?? getConfig('Drawer_maskClosable') ?? false;
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
      if (val) {
        this.$emit('open');
      } else {
        this.$emit('close', this.doReload);
      }
      if (this.lockScroll) {
        document.body.style.overflow = val ? 'hidden' : '';
      }
    }
  },
  mounted() {
    this.$$drawerPanel.addEventListener('transitionend', this.transitionendHandle, false);
  },
  destroyed() {
    this.$$drawerPanel.removeEventListener('transitionend', this.transitionendHandle);
  },
  deactivated() {
    this.close();
  },
  methods: {
    open() {
      this.$emit('update:visible', true);
    },
    close(from) {
      if (from === 'mask' && !this.maskToClose) return;
      this.$emit('update:visible', false);
    },
    calcPanelSize(val) {
      let size = Number(val) > 0 ? `${val}px` : val;
      return `calc(${size} - ${(Number(this.level) - 1) * 60}px)`;
    },
    transitionendHandle(ev) {
      if (ev.target !== ev.currentTarget || !this.transitionFlag) return;
      this.transitionFlag = false;
      if (!this.visible && this.destroyOnClose) {
        this.isVisible = false;
        // 重置 doReload 值
        this.doReload = undefined;
      }
      this.$emit('afterVisibleChange', this.visible);
    }
  },
  render() {
    const { isVisible, loading, closable, title, realzIndex, maskStyle, containerPosition, containerShow, containerStyle, $slots } = this;
    const prefixCls = this.getPrefixCls('drawer--wrapper');
    const cls = {
      [prefixCls]: true,
      [`${prefixCls}-sm`]: this.currentSize === 'small',
      [`${prefixCls}-lg`]: this.currentSize === 'large'
    };
    const maskCls = [
      'drawer-mask',
      {
        [`mask-show`]: this.visible
      }
    ];
    return (
      <div class={cls}>
        <div class={maskCls} style={{ ...maskStyle, zIndex: realzIndex }} onClick={() => this.close('mask')} />
        <div ref="panel" class="drawer-container" style={{ ...containerPosition, ...containerShow, ...containerStyle, zIndex: realzIndex + 1 }}>
          <div class="header">
            <div class="title">{$slots[`title`] || title}</div>
            {closable && (
              <span class="close" title={this.t('drawer.close')} onClick={this.close}>
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
