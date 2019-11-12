<script>
/*
 * @Author: 焦质晔
 * @Date: 2019-11-12 08:07:35
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-11-12 09:45:48
 */
export default {
  name: 'TopInfo',
  props: ['total', 'selectionRows', 'isSelectColumn', 'clearTableHandler'],
  render() {
    return (
      <div class="top-info">
        <el-alert class="alert" closable={false} type="info" show-icon>
          <span class="text" slot="title">
            总共 <i>{this.total}</i> 条数据
            {this.isSelectColumn ? (
              <span>
                ，已选择 <i>{this.selectionRows.length}</i> 项
                <el-button size="small" type="text" style={{ marginLeft: '10px' }} onClick={this.clearTableHandler}>
                  清空
                </el-button>
              </span>
            ) : null}
          </span>
        </el-alert>
        {Array.isArray(this.$slots.moreActions) && this.selectionRows.length ? (
          <el-dropdown size="small" style={{ marginLeft: '10px' }} placement="bottom-start">
            <el-button size="small">
              更多操作
              <i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown" class="dropdown-list">
              {this.$slots.moreActions
                .filter(x => x.tag)
                .map((x, i) => (
                  <el-dropdown-item key={i}>{x}</el-dropdown-item>
                ))}
            </el-dropdown-menu>
          </el-dropdown>
        ) : null}
      </div>
    );
  }
};
</script>

<style lang="less" scoped>
@tableBgColor: #f2f2f2;

.top-info {
  display: flex;
  align-items: center;
  .alert {
    height: 32px;
    padding: 0 @modulePadding;
    background-color: @tableBgColor;
    border: 1px solid @borderColor;
    /deep/ .el-icon-info {
      color: @primaryColor;
    }
    /deep/ .el-alert__content {
      display: flex;
      padding-left: 6px;
      padding-right: 0;
      .text {
        font-size: @textSizeSecondary;
        i {
          font-size: 13px;
          font-weight: 600;
          color: @primaryColor;
          font-style: normal;
        }
      }
    }
  }
}
</style>
