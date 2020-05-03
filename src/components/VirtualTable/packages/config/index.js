/*
 * @Author: 焦质晔
 * @Date: 2020-03-02 21:21:13
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-03 16:39:06
 */
import i18n from '../lang';

const config = {
  // 表格列的默认最小宽度
  defaultColumnWidth: 80,
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
    pageSize: 20
  },
  // 后台返回数据的路径
  dataKey: 'items',
  // 后台返回总条数的 key
  totalKey: 'total',
  // 虚拟滚动的阀值
  virtualScrollY: 150,
  // 表头排序的参数名
  sorterFieldName: 'sortby',
  // 客户端表头排序
  clientSorter: true,
  // 客户端表头筛选
  clientFilter: true,
  // 打印纸的宽度 A4 -> 1040px
  printWidth: 1040,
  // 操作列 dataIndex
  operationColumn: '__action__',
  // 合计行第一列的文本
  summaryText: i18n.t('config.summaryText'),
  // 暂无数据
  emptyText: i18n.t('config.emptyText'),
  // 列定义
  columnFilterText: i18n.t('config.columnFilterText')
};

export default config;
