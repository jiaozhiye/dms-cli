/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-07 21:08:53
 **/
import PropTypes from '../_utils/vue-types';
import { getConfig } from '../_utils/globle-config';
import { isIE } from '../_utils/tool';
import Size from '../_utils/mixins/size';
import Locale from '../_utils/mixins/locale';
import PrefixCls from '../_utils/mixins/prefix-cls';
import dragDialog from './dragDialog';

export default {
  name: 'BaseDialog',
  mixins: [Locale, Size, PrefixCls],
  directives: {
    drag: dragDialog
  },
  props: {
    visible: PropTypes.bool.def(false),
    size: PropTypes.oneOf(['small', 'default', 'large']),
    closable: PropTypes.bool.def(true),
    showFullScreen: PropTypes.bool.def(true),
    destroyOnClose: PropTypes.bool.def(false),
    stopEventBubble: PropTypes.bool.def(false),
    title: PropTypes.string.def(''),
    width: PropTypes.string.def('65%'),
    dragable: PropTypes.bool.def(true),
    top: PropTypes.string.def('10vh'),
    modal: PropTypes.bool.def(true),
    lockScroll: PropTypes.bool.def(true),
    customClass: PropTypes.string,
    maskClosable: PropTypes.bool,
    containerStyle: PropTypes.object.def({})
  },
  data() {
    this.hdHeight = 48;
    this.ftHeight = 52;
    return {
      isVisible: this.visible,
      fullscreen: false
    };
  },
  computed: {
    $$dialog() {
      return this.$refs['dialog'].$el.querySelector('.el-dialog');
    },
    delayTime() {
      return !isIE() ? 300 : 400;
    },
    isShowDialog() {
      return this.destroyOnClose ? this.isVisible : true;
    },
    maskToClose() {
      return this.maskClosable ?? getConfig('BaseDialog_maskClosable') ?? false;
    },
    fullCls() {
      return ['iconfont', this.fullscreen ? 'icon-fullscreen-exit' : 'icon-fullscreen'];
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.resetDialogPosition();
        this.isVisible = val;
      } else {
        setTimeout(() => {
          this.isVisible = false;
          this.fullscreen = false;
        }, this.delayTime);
      }
    }
  },
  deactivated() {
    this.close();
  },
  methods: {
    close() {
      this.$emit('update:visible', false);
    },
    handleClick(e) {
      e.stopPropagation();
      this.fullscreen = !this.fullscreen;
      // 可拖拽 & 全屏状态 重置 left/top
      if (this.dragable && this.fullscreen) {
        this.resetDialogPosition();
      }
      this.$emit('viewportChange', this.fullscreen ? 'fullscreen' : 'default');
    },
    createStyles(isFooter) {
      const ftHeight = isFooter ? this.ftHeight : 0;
      const dialogBodyHeight = this.fullscreen
        ? {
            height: `calc(100vh - ${this.hdHeight}px - ${ftHeight}px)`
          }
        : {
            maxHeight: `calc(100vh - ${this.top} - ${this.top} - ${this.hdHeight}px - ${ftHeight}px)`
          };
      return {
        minHeight: `150px`,
        ...dialogBodyHeight,
        overflowY: `auto`
      };
    },
    resetDialogPosition() {
      if (!this.$$dialog) return;
      this.$$dialog.style.left = 0;
      this.$$dialog.style.top = 0;
    }
  },
  render() {
    const { isShowDialog, showFullScreen, fullscreen, dragable, closable, fullCls, maskToClose, stopEventBubble, containerStyle, $props, $attrs, $listeners, $slots } = this;
    const prefixCls = this.getPrefixCls('dialog--wrapper');
    const cls = {
      [prefixCls]: true,
      [`${prefixCls}-sm`]: this.currentSize === 'small',
      [`${prefixCls}-lg`]: this.currentSize === 'large'
    };
    const wrapProps = {
      ref: 'dialog',
      props: {
        ...$props,
        appendToBody: true,
        showClose: closable,
        fullscreen,
        closeOnClickModal: maskToClose,
        closeOnPressEscape: maskToClose,
        destroyOnClose: false,
        beforeClose: this.close
      },
      attrs: { ...$attrs },
      on: { ...$listeners },
      nativeOn: {
        click: ev => {
          if (!stopEventBubble) return;
          ev.stopPropagation();
        }
      },
      // drag -> 拖拽指令
      directives: dragable ? [{ name: 'drag' }] : null
    };
    const extraStyle = fullscreen ? { paddingBottom: `10px` } : null;
    const isFooterSlot = Object.keys($slots).includes('footer');
    return (
      <el-dialog class={cls} {...wrapProps}>
        {showFullScreen && (
          <span key="fullscreen" title={fullscreen ? this.t('baseDialog.cancelFullScreen') : this.t('baseDialog.fullScreen')} class="fullscreen-btn" onClick={this.handleClick}>
            <i class={fullCls} />
          </span>
        )}
        <div class="container" style={{ ...this.createStyles(isFooterSlot), ...containerStyle, ...extraStyle }}>
          {isShowDialog ? $slots[`default`] : null}
        </div>
        {isShowDialog && isFooterSlot ? $slots[`footer`] : null}
      </el-dialog>
    );
  }
};
