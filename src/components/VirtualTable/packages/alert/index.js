/*
 * @Author: 焦质晔
 * @Date: 2020-03-18 10:22:01
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-13 21:34:44
 */
import Locale from '../locale/mixin';

export default {
  name: 'Alert',
  mixins: [Locale],
  props: ['total', 'selectionKeys'],
  inject: ['$$table'],
  methods: {
    clearHandle() {
      // 清空列选中
      this.$$table.clearRowSelection();
      // 清空表头排序
      this.$$table.clearTableSorter();
      // 清空表头筛选
      this.$$table.clearTableFilter();
      // 清空高级检索
      this.$$table.clearSuperSearch();
    }
  },
  render() {
    const { total, rowSelection, selectionKeys } = this.$$table;
    const cls = [`v-alert`, `size--${this.$$table.tableSize}`];
    return (
      <div class={cls}>
        <i class="iconfont icon-info-circle-fill" />
        <span>
          {this.t('table.alert.total', { total })}
          {!!rowSelection ? `，${this.t('table.alert.selected', { total: selectionKeys.length })}` : ''}
        </span>
        <em onClick={this.clearHandle}>{this.t('table.alert.clear')}</em>
      </div>
    );
  }
};
