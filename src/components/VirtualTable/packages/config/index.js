/*
 * @Author: 焦质晔
 * @Date: 2020-03-02 21:21:13
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-19 17:27:08
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
  // 客户端表头排序
  clientSorter: true,
  // 客户端表头筛选
  clientFilter: true,
  emptyText: '暂无数据...',
  columnFilterText: '列筛选排序'
};

export default config;
