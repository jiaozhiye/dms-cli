/*
 * @Author: 焦质晔
 * @Date: 2020-02-28 23:04:58
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-30 11:07:38
 */
import PropTypes from '@/components/_utils/vue-types';

const columnItem = {
  dataIndex: PropTypes.string.isRequired,
  title: PropTypes.any.isRequired,
  width: PropTypes.number, // 列宽度/最小宽度
  fixed: PropTypes.oneOf(['left', 'right']), // 列固定（IE 下无效）
  align: PropTypes.oneOf(['left', 'center', 'right']), // 设置列的对齐方式
  hidden: PropTypes.bool, // 隐藏列
  ellipsis: PropTypes.bool, // 超过宽度将自动省略
  className: PropTypes.string, // 列样式类名
  sorter: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]), // 列排序
  // 列筛选
  filter: PropTypes.shape({
    type: PropTypes.oneOf(['text', 'checkbox', 'radio', 'number', 'range-number', 'date', 'range-date']).isRequired, // 列筛选类型
    items: PropTypes.array // 筛选列表项
  }),
  required: PropTypes.bool, // 列是否必填
  editRender: PropTypes.func, // 可编辑单元格，参数: row, column; 返回值类型: object
  precision: PropTypes.number, // 数值类型字段的精度
  // 数据字典
  dictItems: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ),
  formatType: PropTypes.oneOf(['date', 'datetime', 'finance', 'secret-name', 'secret-phone', 'secret-IDnumber']), // 字段的格式化类型
  // 底部合计
  summation: PropTypes.shape({
    dataIndex: PropTypes.string, // 服务端合计的数据字段名，建议和 column 的 dataIndex 一致
    unit: PropTypes.string // 合计字段的单位
  }),
  render: PropTypes.func // 列渲染方法，参数: text, row, column, rowIndex, cellIndex; 返回值类型: JSX
};

/**
 * editRender: 返回值
 * {
 *   type: PropTypes.oneOf(['text', 'number', 'select', 'select-multiple', 'checkbox', 'date', 'datetime']).isRequired,
 *   items: PropTypes.arrayOf(PropTypes.shape({
 *     text: PropTypes.string,
 *     value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
 *   })),
 *   editable: PropTypes.bool,
 *   disabled: PropTypes.bool, // true -> 禁用编辑功能，默认为非编辑状态，且禁止切换
 *   extra: PropTypes.shape({
 *     maxlength: PropTypes.number,
 *     max: PropTypes.number,
 *     min: PropTypes.number,
 *     trueValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
 *     falseValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
 *     text: PropTypes.string,
 *     disabled: PropTypes.bool // 表单禁用状态
 *   }),
 *   rules: PropTypes.arrayOf(PropTypes.shape({
 *     required: PropTypes.bool,
 *     message: PropTypes.string,
 *     validator: PropTypes.func // 自定义校验规则，参数: val(表单项的值); 返回值类型: bool
 *   })),
 *   onInput: PropTypes.func,
 *   onChange: PropTypes.func
 * }
 */

export default {
  // 列配置，必要参数
  columns: PropTypes.arrayOf(PropTypes.shape(columnItem).loose).def([]).isRequired,
  // 列变化事件，必要参数
  columnsChange: PropTypes.func.isRequired,
  // 数据数组
  dataSource: PropTypes.array.def([]),
  // 服务端数据每条记录的 uuid
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).def('uid'),
  // 数据请求接口
  fetch: PropTypes.shape({
    api: PropTypes.func.isRequired, // api 接口
    params: PropTypes.object.isRequired, // 接口参数
    xhrAbort: PropTypes.bool, // 是否取消请求
    dataKey: PropTypes.string // 数据路径
  }),
  // 是否带有纵向边框
  border: PropTypes.bool.def(true),
  // 表格的高度
  height: PropTypes.oneOfType[(PropTypes.number, PropTypes.string)],
  // 表格的最大高度
  maxHeight: PropTypes.oneOfType[(PropTypes.number, PropTypes.string)],
  // 页面是否加载中
  loading: PropTypes.bool.def(false),
  // 所有列是否允许拖动列宽调整大小
  resizable: PropTypes.bool.def(true),
  // 尺寸
  size: PropTypes.oneOf(['medium', 'small', 'mini']),
  // 存储 columns 定义的字段名，不能重复
  cacheColumnsKey: PropTypes.string,
  // 是否显示表头
  showHeader: PropTypes.bool.def(true),
  // 设置所有内容过长时显示为省略号
  ellipsis: PropTypes.bool.def(true),
  // 给行附加样式
  rowStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  // 给单元格附加样式
  cellStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  // 合并行或列的计算方法
  spanMethod: PropTypes.func,
  // 行选择
  rowSelection: PropTypes.shape({
    type: PropTypes.oneOf(['checkbox', 'radio']).isRequired, // 多选/单选，checkbox/radio
    selectedRowKeys: PropTypes.array, // 选中项的 key 数组
    disabledRowKeys: PropTypes.array, // 禁止选中项的 key 数组
    onChange: PropTypes.func // 选中项发生变化时的回调
  }),
  // 客户端排序
  clientSorter: PropTypes.bool,
  // 客户端筛选
  clientFilter: PropTypes.bool,
  // 是否显示表格信息
  showAlert: PropTypes.bool.def(true),
  // 是否显示全屏按钮
  showFullScreen: PropTypes.bool.def(true),
  // 是否显示刷新按钮
  showRefresh: PropTypes.bool.def(true),
  // 导出表格数据
  exportExcel: PropTypes.shape({
    fileName: PropTypes.string.isRequired, // 导出的文件名，需包含扩展名[xlsx|csv]
    calcExportHandle: PropTypes.func // 计算导出数据，用于对数据的整理
  }),
  // 表格打印
  tablePrint: PropTypes.shape({}),
  // 是否显示列定义
  showColumnDefine: PropTypes.bool.def(true)
};

/**
 * 事件：
 * change: 分页、排序、筛选变化时触发，参数：pagination, filters, sorter, { currentDataSource: tableData }
 * dataChange: 表格数据变化时触发，参数 tableData
 * summationChange: 表格合计变化时触发，参数 { [dataIndex]: value }
 * rowClick: 行单击事件，参数 row, column, event
 * rowDblclick: 行双击事件，参数 row, column, event
 */
