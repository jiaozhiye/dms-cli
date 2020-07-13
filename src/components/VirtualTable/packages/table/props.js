/*
 * @Author: 焦质晔
 * @Date: 2020-02-28 23:04:58
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-13 22:13:53
 */
import PropTypes from '../../../_utils/vue-types';

const columnItem = {
  dataIndex: PropTypes.string.isRequired,
  title: PropTypes.any.isRequired,
  width: PropTypes.number, // 列宽度/最小宽度
  fixed: PropTypes.oneOf(['left', 'right']), // 列固定（IE 下无效）
  align: PropTypes.oneOf(['left', 'center', 'right']), // 设置列的对齐方式
  hidden: PropTypes.bool, // 是否隐藏列
  ellipsis: PropTypes.bool, // 超过宽度将自动省略
  className: PropTypes.string, // 列样式类名
  children: PropTypes.array, // 内嵌 children，以渲染分组表头
  sorter: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]), // 列排序
  // 列筛选
  filter: PropTypes.shape({
    type: PropTypes.oneOf(['text', 'checkbox', 'radio', 'number', 'range-number', 'date', 'range-date']).isRequired, // 列筛选类型
    items: PropTypes.array // 筛选列表项
  }),
  precision: PropTypes.number, // 数值类型字段的精度
  formatType: PropTypes.oneOf(['date', 'datetime', 'finance', 'secret-name', 'secret-phone', 'secret-IDnumber']), // 字段的格式化类型
  required: PropTypes.bool, // 可编辑列是否必填
  editRender: PropTypes.func, // 可编辑单元格，参数: row, column; 返回值类型: object
  // 数据字典配置
  dictItems: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ),
  // 底部合计
  summation: PropTypes.shape({
    dataIndex: PropTypes.string, // 服务端合计的数据字段名，建议和 column 的 dataIndex 一致
    unit: PropTypes.string, // 合计字段的单位
    onChange: PropTypes.func // 字段合计变化时触发
  }),
  groupSummary: PropTypes.bool.def(false), // 分组汇总
  render: PropTypes.func, // 列渲染方法，参数: text, row, column, rowIndex, cellIndex; 返回值类型: JSX
  extraRender: PropTypes.func // 额外的渲染方法，用于处理导出或打印单元格的值，参数: text, row, column, rowIndex, cellIndex; 返回值类型: string/number
};

/**
 * editRender: 返回值
 * {
 *   type: PropTypes.oneOf(['text', 'number', 'select', 'select-multiple', 'checkbox', 'search-helper', 'date', 'datetime']).isRequired,
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
 *     clearable: PropTypes.bool
 *   }),
 *   helper: PropTypes.shape({
 *     filters: PropTypes.object,
 *     table: PropTypes.object,
 *     fieldAliasMap: PropTypes.func,
 *     open: PropTypes.func,
 *     closed: PropTypes.func
 *   }),
 *   rules: PropTypes.arrayOf(PropTypes.shape({
 *     required: PropTypes.bool,
 *     message: PropTypes.string,
 *     validator: PropTypes.func // 自定义校验规则，参数: val(表单项的值); 返回值类型: bool
 *   })),
 *   onInput: PropTypes.func,
 *   onChange: PropTypes.func,
 *   onEnter: PropTypes.func,
 *   onClick: PropTypes.func
 * }
 */

export default {
  // 列配置，必要参数
  columns: PropTypes.arrayOf(PropTypes.shape(columnItem).loose).def([]).isRequired,
  // 表格列变化事件，必要参数
  columnsChange: PropTypes.func.isRequired,
  // 数据数组
  dataSource: PropTypes.array.def([]),
  // 表格行 key 的取值
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).def('uid'),
  // 向后台请求数据的接口
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
  // 表格尺寸
  size: PropTypes.oneOf(['default', 'medium', 'small', 'mini']),
  // 各种配置的本地存储，值不能重复
  uniqueKey: PropTypes.string,
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
  // 列表项是否可选择
  rowSelection: PropTypes.shape({
    type: PropTypes.oneOf(['checkbox', 'radio']).isRequired, // 选择类型
    selectedRowKeys: PropTypes.array, // 选中项的 key 数组，支持动态赋值
    disabled: PropTypes.func, // 是否允许行选择，参数：row，返回值 bool
    onChange: PropTypes.func // 选中项发生变化时触发
  }),
  // 展开行配置项
  expandable: {
    defaultExpandAllRows: PropTypes.bool, // 默认展开所有行
    rowExpandable: PropTypes.func, // 是否允许行展开，参数：row，返回值 bool
    expandedRowRender: PropTypes.func.isRequired, // 额外的展开行渲染方法
    onChange: PropTypes.func // 展开的行变化时触发
  },
  // 多列排序
  multipleSort: PropTypes.bool.def(true),
  // 是否为前端内存分页
  webPagination: PropTypes.bool.def(false),
  // 是否显示表格顶部信息
  showAlert: PropTypes.bool.def(true),
  // 表格顶部信息放置的位置
  alertPosition: PropTypes.oneOf(['top', 'bottom']).def('top'),
  // 顶部按钮插槽的对其方式
  topSpaceAlign: PropTypes.oneOf(['left', 'right']).def('right'),
  // 是否显示全屏按钮
  showFullScreen: PropTypes.bool.def(true),
  // 是否显示刷新按钮
  showRefresh: PropTypes.bool.def(true),
  // 导出表格数据
  exportExcel: PropTypes.shape({
    fileName: PropTypes.string.isRequired // 导出的文件名，需包含扩展名[xlsx|csv]
  }),
  // 表格打印
  tablePrint: PropTypes.shape({
    showLogo: PropTypes.bool.def(true) // 是否显示打印单 logo
  }),
  // 是否显示列定义
  showColumnDefine: PropTypes.bool.def(true)
};

/**
 * 事件：
 * change: 分页、排序、筛选变化时触发，参数：pagination, filters, sorter, { currentDataSource: tableData, allDataSource: allTableData }
 * dataChange: 表格数据变化时触发，参数 tableData
 * rowClick: 行单击事件，参数 row, column, event
 * rowDblclick: 行双击事件，参数 row, column, event
 */

/**
 * 方法：
 * DO_REFRESH: 刷新表格数据，同时会清空列选中状态
 * INSERT_RECORDS: 插入表格行数据，参数 row|rows, bottom(默认)|top
 * REMOVE_RECORDS: 移除表格数据，参数 rowKeys|rows|row
 * FORM_VALIDATE: 触发表格中的表单校验，返回值：object
 * GET_LOG: 获取操作记录，非空校验、格式校验、数据操作记录，返回值：object
 * CLEAR_LOG：清空表格操作记录
 * CALCULATE_HEIGHT：计算表格高度
 */

// 清空高级检索: 1. fetch.params 变化  2. headFilters 变化  3. 点击清空按钮
