/*
 * @Author: 焦质晔
 * @Date: 2020-02-28 23:04:58
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-05 09:17:18
 */
import PropTypes from '@/components/_utils/vue-types';

const columnItem = {
  dataIndex: PropTypes.string.isRequired,
  title: PropTypes.any.isRequired,
  width: PropTypes.number,
  fixed: PropTypes.oneOf(['left', 'right']), // 列固定（IE 下无效）
  align: PropTypes.oneOf(['left', 'center', 'right']), // 设置列的对齐方式
  ellipsis: PropTypes.bool, // 超过宽度将自动省略
  className: PropTypes.string, // 列样式类名
  sorter: PropTypes.bool, // 列排序
  filter: PropTypes.shape({
    type: PropTypes.oneOf(['text', 'checkbox', 'radio', 'number', 'range-number', 'date', 'range-date']).isRequired, // 列筛选类型
    items: PropTypes.array // 筛选列表项
  }),
  precision: PropTypes.number, // 数值类型字段的精度
  dictList: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ),
  formatType: PropTypes.oneOf(['date', 'datetime', 'finance', 'secret-name', 'secret-phone']), // 字段的格式化类型
  summation: PropTypes.shape({
    dataIndex: PropTypes.string, // 服务端合计的数据字段名，建议和 column 的 dataIndex 一致
    unit: PropTypes.string // 合计字段的单位
  })
};

export default {
  // 列配置
  columns: PropTypes.arrayOf(PropTypes.shape(columnItem).loose).def([]).isRequired,
  // 数据数组
  dataSource: PropTypes.array.def([]),
  // 服务端数据每条记录的 uuid
  uidkey: PropTypes.string.def('uid'),
  // 是否带有纵向边框
  border: PropTypes.bool.def(true),
  // 表格的高度
  height: PropTypes.oneOfType[(PropTypes.number, PropTypes.string)],
  // 表格的最大高度
  maxHeight: PropTypes.oneOfType[(PropTypes.number, PropTypes.string)],
  // 所有列是否允许拖动列宽调整大小
  resizable: PropTypes.bool.def(true),
  // 尺寸
  size: PropTypes.oneOf(['medium', 'small', 'mini']),
  // 是否显示表头
  showHeader: PropTypes.bool.def(true),
  // 设置所有内容过长时显示为省略号
  ellipsis: PropTypes.bool.def(true),
  // 给行附加样式
  rowStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  // 给单元格附加样式
  cellStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  // columns 变化时的回调
  onColumnsChange: PropTypes.func
};
