<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-05-06 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-05-07 11:00:00
 **/
export default {
  name: 'BaseDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    destroyOnClose: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '标题'
    },
    width: {
      type: String,
      default: '50%'
    },
    top: {
      type: String,
      default: '15vh'
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
    closeOnClickModal: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isVisible: this.visible,
      fullscreen: false
    };
  },
  computed: {
    isShowDialog() {
      return this.destroyOnClose ? this.isVisible : true;
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.isVisible = val;
      } else {
        setTimeout(() => {
          this.isVisible = false;
          this.fullscreen = false;
        }, 300);
      }
    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false);
    },
    handleClick(e) {
      e.stopPropagation();
      this.fullscreen = !this.fullscreen;
    }
  },
  render() {
    const { $props, $attrs, $listeners, $slots } = this;
    const wrapProps = {
      key: 'dialog',
      props: {
        ...$props,
        appendToBody: true,
        fullscreen: this.fullscreen,
        beforeClose: this.close
      },
      attrs: { ...$attrs },
      on: { ...$listeners }
    };
    return this.isShowDialog ? (
      <el-dialog class="dialog" {...wrapProps}>
        <span key="fullscreen" class="fullscreen-btn" onClick={this.handleClick}>
          <i class="el-icon-full-screen" />
        </span>
        {Object.keys($slots).map(name => (
          <template key={name} slot={name}>
            {$slots[name]}
          </template>
        ))}
      </el-dialog>
    ) : null;
  }
};
</script>

<style lang="less">
.dialog {
  .el-dialog__header {
    padding: 20px;
    line-height: 1;
    border-bottom: 1px solid #e8e8e8;
    .el-dialog__title {
      font-size: 16px;
      line-height: inherit;
    }
  }
  .el-dialog__body {
    padding: 20px;
  }
  .fullscreen-btn {
    position: absolute;
    right: 42px;
    top: 16px;
    padding: 5px;
    line-height: 1;
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
}
</style>
