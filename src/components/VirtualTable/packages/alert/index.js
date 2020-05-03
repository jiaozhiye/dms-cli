/*
 * @Author: 焦质晔
 * @Date: 2020-03-18 10:22:01
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-03 15:45:54
 */
import i18n from '../lang';

export default {
  name: 'Alert',
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
    const { total, selectionKeys } = this.$$table;
    return (
      <div class="v-alert">
        <i class="iconfont icon-info-circle-fill" />
        <span>
          {i18n.t('alert.total', { total })}，{i18n.t('alert.selected', { total: selectionKeys.length })}
        </span>
        <em onClick={this.clearHandle}>{i18n.t('alert.clear')}</em>
      </div>
    );
  }
};
