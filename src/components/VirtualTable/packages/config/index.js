/*
 * @Author: 焦质晔
 * @Date: 2020-03-02 21:21:13
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-14 13:21:11
 */
import i18n from '../locale';

const config = {
  // 表格列的默认最小宽度
  defaultColumnWidth: 80,
  // 行高的映射表
  rowHeightMaps: {
    default: 43,
    medium: 39,
    small: 35,
    mini: 31
  },
  // table 尺寸的映射
  toTableSize: {
    large: 'medium',
    default: 'small',
    small: 'mini'
  },
  // 分页
  pagination: {
    currentPage: 1,
    pageSize: 20,
    sizes: [10, 20, 30, 40, 50]
  },
  // 汇总
  groupSummary: {
    total: { text: '记录数', value: '*' }
  },
  // 高级检索
  highSearch: {
    showSQL: true
  },
  // 树表格
  treeTable: {
    textIndent: 17 // 缩进 17px
  },
  // 后台返回数据的路径
  dataKey: 'items',
  // 后台返回总条数的 key
  totalKey: 'total',
  // 虚拟滚动的阀值
  virtualScrollY: 150,
  // 表头排序的参数名
  sorterFieldName: 'tsortby',
  // 打印纸的宽度 A4 -> 1040px
  printWidth: 1040,
  // 可选择列
  selectionText: () => i18n.t('table.config.selectionText'),
  // 操作列 dataIndex
  operationColumn: '__action__',
  // 合计行第一列的文本
  summaryText: () => i18n.t('table.config.summaryText'),
  // 暂无数据
  emptyText: () => i18n.t('table.config.emptyText')
};

export default config;
