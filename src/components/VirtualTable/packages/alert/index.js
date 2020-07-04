/*
 * @Author: 焦质晔
 * @Date: 2020-03-18 10:22:01
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-06-10 09:04:48
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
    }
  },
  render() {
    const { total, rowSelection, selectionKeys } = this.$$table;
    return (
      <div class="v-alert">
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
