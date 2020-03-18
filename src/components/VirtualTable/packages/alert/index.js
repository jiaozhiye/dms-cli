/*
 * @Author: 焦质晔
 * @Date: 2020-03-18 10:22:01
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-18 21:27:02
 */
export default {
  name: 'TopInfo',
  inject: ['$$table'],
  computed: {
    total() {
      return this.$$table.tableFullData.length;
    }
  },
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
    const { selectionKeys } = this.$$table;
    return (
      <div class="v-alert">
        <i class="iconfont icon-info-circle-fill" />
        <span>
          总共 <strong>{this.total}</strong> 条数据，已选择 <strong>{selectionKeys.length}</strong> 项
        </span>
        <button onClick={this.clearHandle}>清空</button>
      </div>
    );
  }
};
