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
    closeOnClickModal: {
      type: Boolean,
      default: true
    },
    footerHeight: {
      type: [Number, String],
      default: 53
    },
    containerStyle: {
      type: Object,
      default: () => {}
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
      let hdHeight = '76px';
      let ftHeight = Object.keys(slots).includes('footer') ? `${this.footerHeight}px` : '0px';
      let dialogBodyHeight = this.fullscreen
        ? {
            height: `calc(100vh - ${ftHeight} - ${hdHeight})`
          }
        : {
            maxHeight: `calc(100vh - ${this.top} - ${this.top} - ${ftHeight} - ${hdHeight})`
          };
      return {
        overflowY: 'auto',
        minHeight: '150px',
        ...dialogBodyHeight
      };
    }
  },
  render() {
    const { containerStyle, $props, $attrs, $listeners, $slots } = this;
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

<style lang="less">
.dialog {
  .el-dialog {
    margin: 0 auto;
    .el-dialog__header {
      height: 56px;
      line-height: 56px;
      padding: 0 20px;
      box-sizing: border-box;
      border-bottom: 1px solid #d9d9d9;
      .el-dialog__title {
        font-size: 16px;
        line-height: inherit;
      }
    }
    .el-dialog__body {
      padding: 10px 0;
      .fullscreen-btn {
        position: absolute;
        right: 42px;
        top: 16px;
        padding: 5px;
        line-height: 1;
        cursor: pointer;
        &:hover {
          color: #bb0a30;
        }
      }
      .container {
        padding: 0 20px;
      }
    }
    .el-dialog__footer {
      padding: 10px 20px;
      border-top: 1px solid #d9d9d9;
    }
  }
}
</style>
