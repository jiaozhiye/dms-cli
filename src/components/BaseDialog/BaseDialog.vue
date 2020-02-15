<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-02-15 15:29:13
 **/
export default {
  name: 'BaseDialog',
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
    width: {
      type: String,
      default: '60%'
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
    footerHeight: {
      type: [Number, String],
      default: 53
    },
    containerStyle: {
      type: Object,
      default: () => ({})
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
    },
    createStyles(slots) {
      const hdHeight = '76px';
      const ftHeight = Object.keys(slots).includes('footer') ? `${this.footerHeight}px` : '0px';
      const dialogBodyHeight = this.fullscreen
        ? {
            height: `calc(100vh - ${ftHeight} - ${hdHeight})`
          }
        : {
            maxHeight: `calc(100vh - ${this.top} - ${this.top} - ${ftHeight} - ${hdHeight})`
          };
      // 组件内容高度变化的事件
      this.$emit('heightChange', dialogBodyHeight.maxHeight || dialogBodyHeight.height);
      return {
        overflowY: 'auto',
        minHeight: '150px',
        ...dialogBodyHeight
      };
    }
  },
  render() {
    const { closable, maskClosable, containerStyle, $props, $attrs, $listeners, $slots } = this;
    const wrapProps = {
      key: 'dialog',
      props: {
        ...$props,
        appendToBody: true,
        showClose: closable,
        closeOnClickModal: maskClosable,
        fullscreen: this.fullscreen,
        beforeClose: this.close,
        destroyOnClose: false
      },
      attrs: { ...$attrs },
      on: { ...$listeners }
    };
    return this.isShowDialog ? (
      <el-dialog class="base-dialog" {...wrapProps}>
        <span key="fullscreen" class="fullscreen-btn" onClick={this.handleClick}>
          <i class="el-icon-full-screen" />
        </span>
        {Object.keys($slots).map(name => (
          <section key={name} slot={name} style={name === 'default' ? this.createStyles($slots) : null}>
            <div class="container" style={containerStyle}>
              {$slots[name]}
            </div>
          </section>
        ))}
      </el-dialog>
    ) : null;
  }
};
</script>

<style lang="less" scoped>
.base-dialog {
  /deep/ .el-dialog {
    margin: 0 auto;
    .el-dialog__header {
      height: 56px;
      line-height: 56px;
      padding: 0 15px;
      box-sizing: border-box;
      border-bottom: 1px solid @borderColor;
      .el-dialog__title {
        font-size: 16px;
        line-height: inherit;
      }
      .el-dialog__headerbtn {
        font-size: 18px;
        line-height: 1.075;
        top: 19px;
        right: 15px;
      }
    }
    .el-dialog__body {
      padding: 10px 0;
      .fullscreen-btn {
        position: absolute;
        right: 36px;
        top: 16px;
        padding: 5px;
        cursor: pointer;
        &:hover {
          color: @primaryColor;
        }
      }
      .container {
        height: 100%;
        padding: 0 10px;
      }
    }
    .el-dialog__footer {
      padding: 10px 15px;
      border-top: 1px solid @borderColor;
    }
  }
}
</style>
