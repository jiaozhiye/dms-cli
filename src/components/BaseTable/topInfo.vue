<script>
/*
 * @Author: 焦质晔
 * @Date: 2019-11-12 08:07:35
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-23 22:29:39
 */
import Locale from '../_utils/mixins/locale';

export default {
  name: 'TopInfo',
  mixins: [Locale],
  props: ['total', 'selectionRows', 'isSelectColumn', 'clearTableHandler'],
  render() {
    return (
      <div class="top-info">
        <el-alert class="alert" closable={false} type="info" show-icon>
          <span class="text" slot="title">
            <span>{this.t('baseTable.total', { total: this.total })}</span>
            {this.isSelectColumn && <span>，{this.t('baseTable.selected', { total: this.selectionRows.length })}</span>}
            <el-button size="small" type="text" style={{ marginLeft: '8px' }} onClick={this.clearTableHandler}>
              {this.t('baseTable.clear')}
            </el-button>
          </span>
        </el-alert>
        {Array.isArray(this.$slots.moreActions) && this.selectionRows.length ? (
          <el-dropdown size="medium " style={{ marginLeft: '10px' }} trigger="click" placement="bottom-start">
            <el-button size="small">
              {this.t('baseTable.moreAction')}
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

<style lang="scss" scoped>
$tableBgColor: #f2f2f2;

.top-info {
  display: flex;
  align-items: center;
  .alert {
    height: 32px;
    padding: 0 $modulePadding;
    background-color: $tableBgColor;
    border: 1px solid $borderColor;
    /deep/ .el-icon-info {
      color: $primaryColor;
    }
    /deep/ .el-alert__content {
      display: flex;
      padding-left: 6px;
      padding-right: 0;
      .text {
        font-size: $textSize;
        i {
          font-weight: 600;
          color: $primaryColor;
          font-style: normal;
        }
      }
    }
  }
}
</style>
