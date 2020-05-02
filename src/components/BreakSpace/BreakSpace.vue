<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-02 19:13:15
 **/
export default {
  name: 'BreakSpace',
  props: {
    label: {
      type: String,
      default: ''
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
      <div class="v-form--divider" style={{ ...containerStyle }}>
        <el-divider contentPosition="left">
          <span class="title" style={{ ...labelStyle }}>
            {label}
          </span>
        </el-divider>
      </div>
    );
  }
};
</script>

<style lang="scss" scoped>
.v-form--divider {
  width: 100%;
  height: 32px;
  overflow: hidden;
  /deep/ .el-divider--horizontal {
    margin: 15px 0;
    .el-divider__text {
      padding: 0 $modulePadding;
      &.is-left {
        left: -$moduleMargin;
      }
      .title {
        display: inline-block;
        height: 20px;
        font-size: $textSize;
        &::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 100%;
          background-color: $primaryColor;
          margin-right: 8px;
          vertical-align: middle;
        }
      }
    }
  }
}
</style>
