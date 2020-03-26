/*
 * @Author: 焦质晔
 * @Date: 2020-03-02 21:21:13
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-26 10:08:31
 */
const config = {
  // Vue 应用，根节点 ID
  appRootId: 'app',
  // 行高的映射表
  rowHeightMaps: {
    default: 48,
    medium: 44,
    small: 40,
    mini: 36
  },
  // 分页
  pagination: {
    currentPage: 1,
    pageSize: 10
  },
  // 表头排序的参数名
  sorterFieldName: 'sortby',
  // 客户端表头排序
  clientSorter: true,
  // 客户端表头筛选
  clientFilter: true,
  // 操作列 dataIndex
  operationColumn: '__action__',
  emptyText: '暂无数据...',
  columnFilterText: '列筛选排序'
};

export default config;
