<script>
export default {
  name: 'BreakSpace',
  props: {
    label: {
      type: String,
      default: '标题'
    },
    containerStyle: {
      type: Object,
      default: () => ({})
    },
    labelStyle: {
      type: Object,
      default: () => ({})
    }
  },
  render() {
    const { containerStyle, labelStyle, label } = this;
    return (
      <div class="form-divider">
        <el-divider contentPosition="left" style={{ ...containerStyle }}>
          <span class="title" style={{ ...labelStyle }}>
            {label}
          </span>
        </el-divider>
      </div>
    );
  }
};
</script>

<style lang="less">
.form-divider {
  width: 100%;
  height: 32px;
  overflow: hidden;
  .el-divider--horizontal {
    margin: 15px 0;
    .el-divider__text {
      padding: 0 10px;
      &.is-left {
        left: -10px;
      }
      .title {
        display: inline-block;
        height: 20px;
        font-size: @textSize;
        &::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 100%;
          background-color: @primaryColor;
          margin-right: 8px;
          vertical-align: middle;
        }
      }
    }
  }
}
</style>
