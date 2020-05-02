<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-02 19:12:45
 **/
import dragDialog from '@/directive/el-drag-dialog';

export default {
  name: 'BaseDialog',
  directives: {
    drag: dragDialog
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
      default: ''
    },
    width: {
      type: String,
      default: '60%'
    },
    dragable: {
      type: Boolean,
      default: true
    },
    top: {
      type: String,
      default: '10vh'
    },
    modal: {
      type: Boolean,
      default: true
    },
    lockScroll: {
      type: Boolean,
      default: true
    },
    customClass: {
      type: String
    },
    maskClosable: {
      type: Boolean,
      default: false
    },
    containerStyle: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    this.$$dialog = null;
    this.hdHeight = 48;
    this.ftHeight = 52;
    return {
      isVisible: this.visible,
      fullscreen: false
    };
  },
  computed: {
    delayTime() {
      return !this.isIE() ? 300 : 400;
    },
    isShowDialog() {
      return this.destroyOnClose ? this.isVisible : true;
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
  mounted() {
    this.$$dialog = this.$refs['dialog'].$el.querySelector('.el-dialog');
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
    },
    isIE() {
      return !!window.ActiveXObject || 'ActiveXObject' in window;
    }
  },
  render() {
    const { isShowDialog, fullscreen, dragable, closable, maskClosable, containerStyle, $props, $attrs, $listeners, $slots } = this;
    const wrapProps = {
      ref: 'dialog',
      props: {
        ...$props,
        appendToBody: true,
        showClose: closable,
        closeOnClickModal: maskClosable,
        fullscreen,
        beforeClose: this.close,
        destroyOnClose: false
      },
      attrs: { ...$attrs },
      on: { ...$listeners },
      // drag -> 拖拽指令
      directives: dragable ? [{ name: 'drag' }] : null
    };
    const extraStyle = fullscreen ? { paddingBottom: `10px` } : null;
    const isFooterSlot = Object.keys($slots).includes('footer');
    return (
      <el-dialog class="v-dialog--wrapper" {...wrapProps}>
        <span key="fullscreen" class="fullscreen-btn" onClick={this.handleClick}>
          <i class="el-icon-full-screen" />
        </span>
        <div class="container" style={{ ...this.createStyles(isFooterSlot), ...containerStyle, ...extraStyle }}>
          {isShowDialog ? $slots[`default`] : null}
        </div>
        {isShowDialog && isFooterSlot ? $slots[`footer`] : null}
      </el-dialog>
    );
  }
};
</script>

<style lang="scss" scoped>
.v-dialog--wrapper {
  /deep/ .el-dialog {
    margin: 0 auto;
    .el-dialog__header {
      height: 48px;
      line-height: 48px;
      padding: 0 15px;
      box-sizing: border-box;
      border-bottom: 1px solid $borderColor;
      .el-dialog__title {
        font-size: 16px;
      }
      .el-dialog__headerbtn {
        font-size: 18px;
        line-height: 1.075;
        top: 15px;
        right: 15px;
      }
    }
    .el-dialog__body {
      padding: 0;
      .fullscreen-btn {
        position: absolute;
        right: 35px;
        top: 12px;
        padding: 5px;
        cursor: pointer;
        &:hover {
          color: $primaryColor;
        }
      }
      .container {
        height: 100%;
        padding: 10px;
        overflow-y: auto;
        box-sizing: border-box;
      }
    }
    .el-dialog__footer {
      padding: 10px 15px;
      border-top: 1px solid $borderColor;
    }
  }
}
</style>
