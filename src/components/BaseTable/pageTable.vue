<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-11-12 09:46:15
 **/
import _ from 'lodash';
import moment from 'moment';
import config from '@/config';
import { mergeProps, getOptionProps } from '@/utils/props-util';
import TopInfo from './topInfo';
import ColumnFilter from './columnFilter';
import Pagination from './pagination';
import Spin from '@/components/Spin/Spin';

export default {
  name: 'PageTable',
  props: {
    height: {
      type: [Number, String]
    },
    maxHeight: {
      type: [Number, String]
    },
    columns: {
      type: Array,
      required: true,
      default: () => []
    },
    columnsRef: {
      type: String,
      default: ''
    },
    dataSource: {
      type: [Array, Object],
      default: () => []
    },
    fetchapi: Function,
    params: {
      type: Object,
      default: () => ({})
    },
    uidkey: {
      type: String,
      default: 'uid'
    },
    datakey: {
      type: String,
      default: 'items'
    },
    isMemoryPagination: {
      type: Boolean,
      default: false
    },
    rowstyles: {
      type: Array,
      default: () => []
    },
    cellstyles: {
      type: Array,
      default: () => []
    },
    selectionType: {
      type: String,
      default: 'multiple'
    },
    defaultSelections: {
      type: Array,
      default: () => []
    },
    filters: {
      type: Object,
      default: () => ({})
    },
    isSelectColumn: {
      type: Boolean,
      default: true
    },
    isToperInfo: {
      type: Boolean,
      default: true
    },
    isColumnFilter: {
      type: Boolean,
      default: true
    },
    isPagination: {
      type: Boolean,
      default: true
    },
    mergeCellMethod: {
      type: Function,
      default: () => {}
    },
    onColumnsChange: {
      type: Function,
      required: true
    },
    onRowSelectChange: {
      type: Function,
      default: () => {}
    },
    onCellChange: {
      type: Function,
      default: () => {}
    },
    onPageChange: {
      type: Function,
      default: () => {}
    },
    onEnterEvent: {
      type: Function,
      default: () => {}
    },
    onSyncTableData: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    this.originData = []; // 原始数据, 用于客户端表头过滤筛选
    this.backUpData = []; // 备份数据
    this.minHeight = 200; // table 最小高度
    this.cellValChange = false; // 单元格数据是否改变
    this.tableBody = null;
    return {
      loading: false,
      list: [], // 列表数据
      tableHeight: this.height || this.minHeight, // 高度
      selectionRows: [], // table 选中行
      disabledRows: [], // table 禁用行
      filterParams: {}, // 表头筛选参数
      sorterParams: {}, // 表头排序参数
      // 分页
      pagination: {
        current: config.table.pageNum || 1,
        pageSize: config.table.pageSize || 20,
        total: 0
      },
      // 单元格的上一步操作
      prevHandle: {
        row: null,
        key: ''
      },
      // 可编辑单元格坐标
      editPos: {
        rowIndex: -1,
        editableColumnIndex: -1,
        marks: this.createEditableKeys(this.createFilterColumns(this.columns))
      },
      // 对表格的操作记录
      actionsLog: {
        update: [],
        insert: [],
        remove: [],
        required: [],
        searchHelper: []
      },
      // 服务端合计
      summaries: {}
    };
  },
  computed: {
    isEditable() {
      return Boolean(this.createEditableKeys().length);
    },
    isShowSummary() {
      return this.columnFlatMap(this.columns).some(x => x.summation);
    },
    isShowPagination() {
      return (this.isPagination && Boolean(this.fetchapi)) || this.isMemoryPagination;
    },
    fetchParams() {
      const { current, pageSize } = this.pagination;
      const pagination = this.isShowPagination
        ? {
            currentPage: current,
            pageSize, // 必须
            pageNum: current,
            limit: pageSize,
            current, // 必须
            size: pageSize
          }
        : {};
      const queries = {
        ...this.sorterParams,
        ...this.filterParams,
        ...this.params,
        ...pagination
      };
      // 移除 noJumper 属性
      delete queries.noJumper;
      // console.log('table 组件中 ajax 请求条件：', queries);
      return queries;
    },
    columnKeysChange() {
      return this.columns
        .filter(x => !x.hidden)
        .map(x => x.dataIndex)
        .join('|');
    },
    editableColumns() {
      return this.columnFlatMap(this.columns).filter(x => x.editable);
    },
    listChange() {
      const editableKeys = this.createEditableKeys();
      // 不可编辑表格
      if (!editableKeys.length) return null;
      return this.list.map(x => {
        let item = {};
        editableKeys.forEach(key => _.set(item, key, _.get(x, key)));
        return item;
      });
    }
  },
  watch: {
    dataSource(nextProps) {
      this.createTableList(nextProps);
    },
    height(nextProps) {
      this.tableHeight = nextProps || this.minHeight;
    },
    params(nextProps) {
      // 不返回到第一页
      if (nextProps.noJumper) return;
      this.toFirstPage();
    },
    fetchParams(nextProps, prevProps) {
      // 内存分页 && 只有页码发生变化
      if (this.isMemoryPagination && this.isOnlyPageChange(nextProps, prevProps)) {
        this.createLimitRecords();
      } else {
        this.getTableData();
      }
    },
    columnKeysChange() {
      // Element-UI v2.10.x 及以上的版本，在切换表格列显示/隐藏状态时，特别是最后一列，可能会出现 tr 对不齐的 bug
      this.$nextTick(() => this.resetRender());
    },
    defaultSelections(nextProps) {
      this.createRowSelection(nextProps);
    },
    columns(nextProps) {
      if (!this.isEditable) return;
      this.editPos.marks = this.createEditableKeys(this.createFilterColumns(nextProps));
    },
    filters(nextProps, prevProps) {
      if (_.isEqual(nextProps, prevProps)) return;
      this.filterHandler();
    },
    listChange(nextProps, prevProps) {
      if (_.isEqual(nextProps, prevProps)) return;
      this.syncTableList();
    }
  },
  mounted() {
    this.createTableList(this.dataSource);
    this.createRowSelection(this.defaultSelections);
    this.getTableData();
    this.createTableBody();
    this.calcTableHeight();
    this.bindWindowResizeEvent();
    this.bindkeyboardEvent();
    this.bindDocumentEvent();
  },
  beforeDestroy() {
    // 解绑事件，防止内存泄漏
    window.removeEventListener('resize', this.calcTableHeight);
    document.removeEventListener('keydown', this.keyboardEventHandle);
    document.removeEventListener('click', this.documentEventHandle);
  },
  methods: {
    // 可编辑单元格的 dataIndex，支持对隐藏列的过滤
    createEditableKeys(columns) {
      columns = Array.isArray(columns) ? columns : this.columns;
      return this.columnFlatMap(columns)
        .filter(x => x.editable)
        .map(x => x.dataIndex);
    },
    // 初始化 table row 选中
    createRowSelection(selectedRows) {
      // 清空行选中状态
      this.clearSelectionHandle();
      if (!selectedRows.length) return;
      // 单选时
      if (this.selectionType === 'single') {
        selectedRows.length = 1;
      }
      selectedRows.forEach(row => this.toggleSelectionHandle(row, true));
    },
    // 创建内存分页的列表数据
    createLimitRecords() {
      const { current, pageSize } = this.pagination;
      this.list = this.originData.slice((current - 1) * pageSize, current * pageSize);
    },
    // 是否仅有分页参数产生变化
    isOnlyPageChange(nextProps, prevProps) {
      const diff = Object.keys(this.difference(nextProps, prevProps)).join('|');
      return diff.includes('current') || diff.includes('pageSize');
    },
    // 创建表格数据
    createTableList(data) {
      const keypath = this.datakey;
      const uidkey = this.uidkey;
      const dataList = Array.isArray(data) ? data : _.get(data, keypath, []);
      // 说明不是外部对 dataSource 重新赋值，不重新处理数据
      if (dataList.dataMark) return;
      // 设置数据标识符，状态变量
      dataList.dataMark = true;
      // 处理列表数据
      if (this.isMemoryPagination) {
        this.originData = this.createTableDataKey(dataList, uidkey);
        // 初始化分页数据
        this.createLimitRecords();
        this.backUpData = [...this.originData];
      } else {
        this.list = this.createTableDataKey(dataList, uidkey);
        this.originData = [...this.list];
      }
      // 同步表格数据
      this.syncTableList(true);
      // 总记录数
      this.pagination.total = this.createPageTotal(data, keypath);
      // 清空行选中状态
      this.clearSelectionHandle();
      // 清空table组件操作记录
      this.clearTableHandleLog();
      // 清空表头筛选条件
      this.clearTHeadFilters();
      // 清空表头排序条件
      this.clearTHeadSort();
      // 重置可编辑单元格坐标
      this.editPos.rowIndex = -1;
      this.editPos.editableColumnIndex = -1;
      // 重置滚动条位置
      this.$nextTick(() => {
        this.scrollTopToPosition(0);
        this.scrollLeftToPosition(0);
        this.resetRender();
      });
    },
    // 处理列表数据
    createTableDataKey(dataList, uidkey) {
      const { current, pageSize } = this.pagination;
      dataList.forEach((x, i) => {
        x.index = (current - 1) * pageSize + i; // 序号
        x._uid = x[uidkey] || x._uid || this.createUidKey(); // 字段值唯一不重复的 key
        this.columnFlatMap(this.columns).forEach(column => {
          const { dataIndex, precision, editable, editType } = column;
          if (_.isUndefined(_.get(x, dataIndex))) {
            _.set(x, dataIndex, '');
          }
          const val = _.get(x, dataIndex);
          if (editType === 'number' && precision >= 0 && !isNaN(Number(val))) {
            _.set(x, dataIndex, Number(val).toFixed(precision));
          }
          if (editable) {
            // 单元格默认编辑状态
            this.setCellEditState(x, dataIndex, false);
          }
        });
      });
      return dataList;
    },
    // 处理总记录数
    createPageTotal(data, keypath) {
      let res = 0;
      const targetIndex = keypath.lastIndexOf('.');
      if (Array.isArray(data)) {
        res = data.length;
      } else {
        if (targetIndex !== -1) {
          data = _.get(data, keypath.slice(0, targetIndex)) || {};
        }
        res = data.total || 0;
      }
      // 处理服务端合计
      if (this.isShowSummary) {
        this.columnFlatMap(this.columns)
          .filter(x => x.summation && x.summationDataIndex)
          .forEach(x => {
            this.summaries[x.summationDataIndex] = data[`${x.summationDataIndex}Summary`];
          });
      }
      return res;
    },
    // 同步组件数据列表
    syncTableList(isFirst) {
      const rows = this.isMemoryPagination ? this.originData : this.list;
      // 重置组件数据列表的索引
      rows.forEach((row, i) => (row.$index = i));
      this.onSyncTableData(rows, Boolean(isFirst));
    },
    // 跳转到第一页
    toFirstPage() {
      this.pagination.current = 1;
    },
    // 单元格编辑后的渲染方法
    editedScopedRender(column, props) {
      const { editType } = column;
      let res = _.get(props.row, column.dataIndex);
      if (editType === 'select' || editType === 'select-multiple' || editType === 'checkbox') {
        if (Array.isArray(column.editItems) && column.editItems.length) {
          const editItems = editType === 'checkbox' ? column.editItems.map(x => ({ value: x['trueValue'] || x['falseValue'], ...x })) : column.editItems;
          res = Array.isArray(res) ? res : [res];
          res = editItems
            .filter(x => res.includes(x.value))
            .map(x => x.text)
            .join(', ');
        }
      }
      res = this.numberFormat(column, res);
      res = this.dateFormat(column, res);
      return res;
    },
    // 单元格处于可编辑状态的渲染方法
    edittingScopedRender(column, props) {
      const { dataIndex, editType } = column;
      const isDisabled = Boolean(props.row[`${dataIndex}Disabled`]);
      const prevValue = _.get(props.row, dataIndex);
      if (editType === 'select' || editType === 'select-multiple') {
        return (
          <el-select
            size="mini"
            multiple={editType === 'select-multiple'}
            value={prevValue}
            onInput={val => _.set(props.row, dataIndex, val)}
            placeholder="请选择"
            clearable={true}
            disabled={column.disabled || isDisabled}
            onChange={value => {
              this.editCellChangeHandle(value, props.row._uid, dataIndex);
            }}
          >
            {Array.isArray(column.editItems) && column.editItems.map(item => <el-option key={item.value} label={item.text} value={item.value} />)}
          </el-select>
        );
      }
      if (editType === 'checkbox') {
        const { trueValue = '1' } = column.editItems.find(x => typeof x.trueValue !== 'undefined') || {};
        const { falseValue = '0' } = column.editItems.find(x => typeof x.falseValue !== 'undefined') || {};
        return (
          <el-checkbox
            value={prevValue}
            onInput={val => _.set(props.row, dataIndex, val)}
            disabled={column.disabled || isDisabled}
            trueLabel={trueValue}
            falseLabel={falseValue}
            onChange={value => {
              this.editCellChangeHandle(value, props.row._uid, dataIndex);
            }}
          >
            {this.editedScopedRender(column, props)}
          </el-checkbox>
        );
      }
      if (editType === 'date-picker') {
        const { dateFormat, minDateTime, maxDateTime } = column;
        const conf = this.createDateType(dateFormat);
        return (
          <el-date-picker
            type={conf.dateType}
            size="mini"
            value={prevValue}
            onInput={val => _.set(props.row, dataIndex, val)}
            placeholder={conf.placeholder}
            format={conf.format}
            value-format={conf.format}
            clearable={false}
            disabled={column.disabled || isDisabled}
            picker-options={{
              disabledDate(time) {
                if (minDateTime) {
                  const target = !new Date(minDateTime).getTime() ? this.getFormatData(props.row, minDateTime) : minDateTime;
                  return time.getTime() < new Date(target).getTime();
                }
                if (maxDateTime) {
                  const target = !new Date(maxDateTime).getTime() ? this.getFormatData(props.row, maxDateTime) : maxDateTime;
                  return time.getTime() > new Date(target).getTime();
                }
                return false;
              }
            }}
            onChange={value => {
              this.editCellChangeHandle(value, props.row._uid, dataIndex);
            }}
          />
        );
      }
      // 校验数字的正则
      const numberReg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
      // 默认精度是两位
      const { precision } = column;
      return (
        <el-input
          class={`input-${props.$index}-${this.createClassName(dataIndex)}`}
          size="mini"
          maxlength={column.maxlength}
          value={prevValue}
          disabled={column.disabled || isDisabled}
          onInput={val => {
            // 单元格正则校验
            if (_.isRegExp(column.editPattern)) {
              // 是否为删除动作
              let isRemoveHandle = val.length < (prevValue && prevValue.length);
              // 单元格正则校验
              if (!isRemoveHandle && !column.editPattern.test(val)) return;
            }
            // 数值类型的校验
            if (editType === 'number') {
              let isPassCheck = (!Number.isNaN(val) && numberReg.test(val)) || val === '' || val === '-';
              if (!isPassCheck) return;
              // 不允许是负数
              if (column.min === 0 && val === '-') return;
              let chunks = val.split('.');
              // 判断整型
              if (precision === 0 && chunks.length > 1) return;
              // 判断浮点型
              if (precision > 0 && chunks.length > 1 && chunks[1].length > precision) return;
              // 判断最大值/最小值
              if (_.isNumber(column.max) && Number(val) > column.max) return;
              if (_.isNumber(column.min) && Number(val) < column.min) return;
            }
            _.set(props.row, dataIndex, val);
          }}
          onChange={value => {
            if (editType === 'number') {
              value = this.parseNumber(value, precision);
            }
            this.editCellChangeHandle(value, props.row._uid, dataIndex);
          }}
          onBlur={e => {
            const { value } = e.target;
            if (editType === 'number') {
              _.set(props.row, dataIndex, this.parseNumber(value, precision));
            }
            // 单元格非空校验
            if (column.editRequired) {
              this.validateRequired(dataIndex, props.row._uid, _.get(props.row, dataIndex));
            }
          }}
        />
      );
    },
    // 单元格搜索帮助的渲染方法
    searchHelpeRender(column, props) {
      const {
        dataIndex,
        searchHelper: { aliasKey, supportInput }
      } = column;
      const isDisabled = Boolean(props.row[`${dataIndex}Disabled`]);
      const prevValue = _.get(props.row, dataIndex);
      return (
        <el-autocomplete
          class={`input-${props.$index}-${this.createClassName(dataIndex)}`}
          size="mini"
          popper-class="autocomplete"
          maxlength={column.maxlength}
          style={{ width: '100%' }}
          value={prevValue}
          disabled={column.disabled || isDisabled}
          onInput={val => _.set(props.row, dataIndex, val)}
          onSelect={val => this.syncAllCellValue(val, props.row, column)}
          fetchSuggestions={(queryString, cb) => this.querySearchAsync(column, props.row, queryString, cb)}
          nativeOnChange={e => {
            const { value } = e.target;
            // 不支持自定义输入
            if (!supportInput) {
              this.validateSearchHelper(dataIndex, props.row._uid, 'add');
            }
            if (value !== '') {
              this.editCellChangeHandle(value, props.row._uid, dataIndex);
            }
            this.cellValChange = true;
          }}
          nativeOnKeydown={e => {
            if (e.keyCode === 38 || e.keyCode === 40) {
              e.stopPropagation();
            }
          }}
          onBlur={e => {
            const { value } = e.target;
            // 如果清空了搜索帮助的值，把其关联的单元格置空
            if (this.cellValChange && value === '') {
              this.syncAllCellValue({}, props.row, column);
            }
            // 单元格非空校验
            if (column.editRequired) {
              this.validateRequired(dataIndex, props.row._uid, _.get(props.row, dataIndex));
            }
            this.cellValChange = false;
          }}
          scopedSlots={{
            default: props => {
              const { item } = props;
              const nodeList = [
                <td key={dataIndex}>
                  <span>{`${column.title}：${item[dataIndex]}`}</span>
                </td>,
                ...Object.keys(item)
                  .filter(key => key !== dataIndex && !Object.values(aliasKey).find(x => x.dataIndex === key).disabled)
                  .map(key => (
                    <td key={key}>
                      <span>{`${this.deepFind(this.columns, key).title}：${item[key]}`}</span>
                    </td>
                  ))
              ];
              return nodeList;
            }
          }}
        />
      );
    },
    // 表头筛选的渲染方法
    filterColumnScopedRender(h, column) {
      const filterScopedSlots = {};
      if (column.filter) {
        filterScopedSlots.scopedSlots = {
          header: props => column.renderHeader(props, column.filterType)
        };
      }
      return filterScopedSlots;
    },
    // 可编辑列的渲染方法
    editColumnScopedRender(h, column) {
      const { dataIndex } = column;
      // 这种写法没法获取到变化的数据，vue react 都是这种情况
      // const { required, searchHelper } = this.actionsLog;
      const editScopedSlots = {};
      if (column.editable) {
        editScopedSlots.scopedSlots = {
          default: props => {
            let targetNode = null;
            let errMessages = [];
            // 单元格可编辑
            if (props.row[`${dataIndex}IsEdit`] && !props.row[`${dataIndex}DisableEdit`]) {
              // 单元格非空校验
              if (this.actionsLog.required.some(x => x.xUid === props.row._uid && x.yDataIndex === dataIndex)) {
                errMessages.push(`${column.title}不能为空`);
              }
              // 搜索帮助校验
              if (this.actionsLog.searchHelper.some(x => x.xUid === props.row._uid && x.yDataIndex === dataIndex)) {
                errMessages.push(`${column.title}只能选择`);
              }
              targetNode = column.searchHelper ? this.searchHelpeRender(column, props) : this.edittingScopedRender(column, props);
              return this.createCellNode(targetNode, errMessages);
            }
            if (props.row[`${dataIndex}DisableEdit`] && column.editDisableRender) {
              // 强制渲染可编辑的单元格
              targetNode = column.editDisableRender(props, h);
            } else {
              // 单元格不可编辑
              targetNode = this.editedScopedRender(column, props);
            }
            return this.createCellNode(targetNode, errMessages, column.showOverflowTooltip);
          }
        };
      }
      return editScopedSlots;
    },
    // 创建单元格渲染节点
    createCellNode(JSXNode, msgs = [], isTooltip) {
      const cls = {
        [`el-form-item`]: true,
        [`is-error`]: !!msgs.length
      };
      const domStyle = isTooltip ? { whiteSpace: 'pre' } : null;
      return (
        <span class={cls} style={domStyle}>
          {JSXNode}
          {msgs.map(msg => (
            <div class="form-item-error">{msg}</div>
          ))}
        </span>
      );
    },
    // 可选择列渲染方法
    selectionColumnRender() {
      return this.selectionType === 'single' ? (
        <el-table-column
          key="-"
          prop="-"
          label="选择"
          fixed="left"
          width="50"
          scopedSlots={{
            default: props => {
              return (
                <el-radio
                  value={_.get(this.selectionRows[0], '_uid')}
                  onInput={val => {
                    this.selectionRows = [this.list.find(x => x._uid === val)];
                  }}
                  label={props.row._uid}
                  disabled={this.canRowSelected(props.row)}
                  onChange={val => {
                    this.handleSelectionChange(this.list.find(x => x._uid === val));
                  }}
                  nativeOnClick={e => e.stopPropagation()}
                />
              );
            }
          }}
        />
      ) : (
        <el-table-column key="-" prop="-" type="selection" reserveSelection={true} fixed="left" width="50" selectable={row => !this.canRowSelected(row)} />
      );
    },
    // 创建表格列字段
    createTableColumns(columns) {
      const tableColumns = columns
        .filter(x => !x.hidden)
        .map((x, i) => {
          const defaultRender = !x.render
            ? {
                scopedSlots: {
                  default: props => {
                    return this.createCellNode(this.editedScopedRender(x, props), [], x.showOverflowTooltip);
                  }
                }
              }
            : {};
          const render = x.render
            ? {
                scopedSlots: {
                  default: props => {
                    return this.createCellNode(x.render(props, h), [], x.showOverflowTooltip);
                  }
                }
              }
            : {};
          const filter = this.filterColumnScopedRender(h, x);
          const editer = this.editColumnScopedRender(h, x);
          const wrapProps = mergeProps(defaultRender, filter, editer, render);
          return (
            <el-table-column
              key={`${x.dataIndex}-${i}`}
              prop={x.dataIndex}
              label={x.title}
              width={x.width}
              minWidth={x.minWidth || this.calcHeaderWidth(x.title)}
              fixed={x.fixed}
              align={x.align}
              labelClassName={x.editRequired && 'is-required'}
              className={x.className}
              showOverflowTooltip={x.showOverflowTooltip}
              sortable={config.table.serverSort || x.sorter ? 'custom' : false}
              {...wrapProps}
            >
              {Array.isArray(x.children) && this.createTableColumns(x.children)}
            </el-table-column>
          );
        });
      return tableColumns;
    },
    // 创建表格列字段
    createColumns(columns) {
      let target = this.createTableColumns(columns);
      if (this.isSelectColumn) {
        target = [this.selectionColumnRender(), ...target];
      }
      return target;
    },
    // 生成 uuid key
    createUidKey(key = '') {
      if (key !== '') {
        key += '-';
      }
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        let r = (Math.random() * 16) | 0;
        let v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
      return key + uuid;
    },
    // 根据表头字数自动计算列宽度
    calcHeaderWidth(text = '') {
      let l = text.length || 1;
      let f = 14;
      // 每个字大小，其实是每个字的比例值，大概会比字体大小差不多大一点
      return f * l + 65;
    },
    // 判断 table 行是否可以被选中
    canRowSelected(row) {
      const uids = this.disabledRows.map(x => x._uid);
      return uids.includes(row._uid);
    },
    // 格式化数值类型
    parseNumber(value, n) {
      // '.' 在最后或者仅有一个字符 '-'
      if (value.charAt(value.length - 1) === '.' || value === '-') {
        value = value.slice(0, -1);
      }
      if (value !== '' && n >= 0 && !isNaN(Number(value))) {
        value = Number(value).toFixed(n);
      }
      return value;
    },
    // 金融格式数字的格式化方法
    numberFormat(column, input) {
      const { precision } = column;
      if (precision >= 0 && !isNaN(Number(input))) {
        input = Number(input).toFixed(precision);
      }
      if (column.numberFormat) {
        input = this.formatNumber(input);
      }
      return input;
    },
    // 日期的格式化方法
    dateFormat(column, input) {
      if (column.dateFormat) {
        const dateFormat = column.dateFormat.replace('yyyy', 'YYYY').replace('dd', 'DD');
        const dateVal = moment(input).format(dateFormat);
        input = dateVal === 'Invalid date' ? input : dateVal;
      }
      return input;
    },
    // 匹配日期控件的 dateType
    createDateType(format = 'yyyy-MM-dd HH:mm:ss') {
      // 配置项
      const config = {
        date: { placeholder: '选择日期', format: 'yyyy-MM-dd' },
        datetime: { placeholder: '选择时间', format: 'yyyy-MM-dd HH:mm:ss' }
      };
      let res = {};
      for (let key in config) {
        if (config[key].format === format) {
          res = Object.assign({}, config[key], { dateType: key });
          break;
        }
      }
      return res;
    },
    // 组装搜索帮助数据列表
    createSerachHelperList(arr, aliasKey) {
      const allColumns = this.columnFlatMap(this.columns);
      return arr.map(x => {
        const item = {};
        for (let attr in x) {
          if (Object.keys(aliasKey).includes(attr)) {
            const { dataIndex } = aliasKey[attr];
            const { editType, precision } = allColumns.find(x => x.dataIndex === dataIndex);
            // 处理数值类型的可编辑单元格，显示数据的精度
            if (editType === 'number' && precision >= 0 && !isNaN(Number(x[attr]))) {
              item[dataIndex] = Number(x[attr]).toFixed(precision);
            } else {
              item[dataIndex] = x[attr];
            }
          }
        }
        return item;
      });
    },
    // 同步搜索帮助相关的单元格数据
    syncAllCellValue(data, row, column) {
      const {
        dataIndex,
        searchHelper: { aliasKey, supportInput }
      } = column;
      for (let attr in aliasKey) {
        const key = aliasKey[attr].dataIndex;
        const item = this.list.find(x => x._uid === row._uid);
        // 如果值是 undefined，重置为空串
        data[key] = typeof data[key] !== 'undefined' ? data[key] : '';
        // 设置相关单元格的值
        _.set(item, key, data[key]);
        // 其他单元格的非空校验
        if (this.deepFind(this.columns, key).editRequired) {
          this.validateRequired(key, item._uid, data[key]);
          if (data[key] !== '' && dataIndex !== key) {
            this.setCellEditState(item, key, false);
          }
        }
        // 触发 cellChange 回调
        this.editCellChangeHandle(data[key], item._uid, key);
      }
      if (!supportInput) {
        this.validateSearchHelper(dataIndex, row._uid, 'remove');
      }
    },
    // 单元格非空校验
    validateRequired(dataIndex, uid, value) {
      const type = value === '' ? 'add' : 'remove';
      this.validateHandler('required', dataIndex, uid, type);
    },
    // 搜索帮助校验
    validateSearchHelper(dataIndex, uid, type) {
      this.validateHandler('searchHelper', dataIndex, uid, type);
    },
    // 单元格校验处理方法
    validateHandler(key, dataIndex, uid, type) {
      if (type === 'add') {
        this.setCellEditState(
          this.list.find(x => x._uid === uid),
          dataIndex,
          true
        );
        this.actionsLog[key] = [...new Set([...this.actionsLog[key], { xUid: uid, yDataIndex: dataIndex }])];
      }
      if (type === 'remove') {
        if (dataIndex !== '') {
          this.actionsLog[key] = this.actionsLog[key].filter(x => !(x.xUid === uid && x.yDataIndex === dataIndex));
        } else {
          // 整行移除
          this.actionsLog[key] = this.actionsLog[key].filter(x => !(x.xUid === uid));
        }
      }
    },
    // 单元格数据变化时的处理方法
    editCellChangeHandle(val, uid, key) {
      // 记录修改行操作
      const target = this.list.filter(x => !x.isNewRow).find(x => x._uid === uid);
      if (target) {
        // 去重
        this.actionsLog.update = [...new Set([...this.actionsLog.update, target])];
      }
      this.onCellChange(
        { [`${uid}|${key}`]: val },
        this.list.find(x => x._uid === uid)
      );
    },
    // ajax 获取搜索帮助服务端数据
    async querySearchAsync(column, row, queryString = '', cb) {
      const {
        dataIndex,
        searchHelper: { fetchApi, params = {}, datakey = '', aliasKey }
      } = column;
      // 搜索帮助数据的 key
      const [key] = Object.entries(aliasKey).find(x => x[1].dataIndex === dataIndex) || [];
      if (_.isUndefined(key)) return;
      if (process.env.MOCK_DATA === 'true') {
        const res = require('@/mock/sHelperData').default;
        setTimeout(() => {
          cb(this.createSerachHelperList(res.data, aliasKey));
        }, 500);
      } else {
        const res = await fetchApi({ ...{ [key]: queryString }, ...params });
        if (res.resultCode === 200) {
          const list = !datakey ? res.data : _.get(res.data, datakey, []);
          cb(this.createSerachHelperList(list, aliasKey));
        }
      }
    },
    // ajax 获取服务端列表数据
    async getTableData() {
      // 没有 api 接口，xhrAbort: true，取消本次请求
      if (!this.fetchapi || this.fetchParams.xhrAbort) return;
      if (process.env.MOCK_DATA === 'true') {
        const res = require('@/mock/tableData').default;
        // 构建表格数据
        this.createTableList(res.data);
      } else {
        const params = { ...this.fetchParams };
        // 移除 xhrAbort 属性
        delete params.xhrAbort;
        this.START_LOADING();
        try {
          const res = await this.fetchapi(params);
          if (res.resultCode === 200) {
            // 构建表格数据
            this.createTableList(res.data);
          }
        } catch (e) {
          this.createTableList({});
        }
        this.STOP_LOADING();
      }
    },
    // 移除数组中的记录
    removeItemHandle(arr, item) {
      arr.splice(
        arr.findIndex(x => x === item),
        1
      );
    },
    // 删除列表记录方法
    deleteHandler(rows = []) {
      // 需要移除的数据，选中行 + 参数
      const removedRows = [...new Set([...rows, ...this.selectionRows])];
      // 移除数据
      for (let i = 0; i < this.list.length; i++) {
        if (removedRows.includes(this.list[i])) {
          if (this.isMemoryPagination) {
            this.removeItemHandle(this.backUpData, this.list[i]);
          }
          this.removeItemHandle(this.originData, this.list[i]);
          this.list.splice(i--, 1);
        }
      }
      // 记录删除操作
      this.actionsLog.remove.push(...removedRows);
      // 修改 total 数量
      this.pagination.total -= removedRows.length;
      // 删除记录中是否包含 非空校验 和 搜索帮助 的非法数据
      removedRows.forEach(row => {
        this.actionsLog.required.some(x => x.xUid === row._uid) && this.validateRequired('', row._uid, 'remove');
        this.actionsLog.searchHelper.some(x => x.xUid === row._uid) && this.validateSearchHelper('', row._uid, 'remove');
      });
      // 清空行选中状态
      this.clearSelectionHandle();
      // 计算组件操作记录
      this.resetExecuteLog();
      return removedRows;
    },
    // 创建列筛选后的列字段数组
    createFilterColumns(columns) {
      let res = [];
      columns.forEach(x => {
        let target = { ...x };
        if (Array.isArray(x.children)) {
          target.children = this.createFilterColumns(x.children);
        }
        if (!target.hidden) {
          res.push(target);
        }
      });
      return res;
    },
    // 单元格单击时
    cellClickHandler(row, { property }, cell, e) {
      const column = this.columnFlatMap(this.columns).find(x => x.dataIndex === property) || {};
      // 有可选择列 - 不是操作列 - 没有阻止行选中
      if (this.isSelectColumn && property !== 'column-action' && !column.stopRowSelection) {
        // 单击可选择列 或 表格不可编辑
        if (property === '-' || !this.isEditable) {
          this.toggleSelectionHandle(row);
        }
      }
      // 说明是单击的是同一个单元格
      if (row === this.prevHandle.row && this.prevHandle.key === property) return;
      // 如果有上一个处于可编辑状态的，取消
      this.cancelPrevCellEditState();
      const target = this.createEditableKeys().includes(property);
      if (!target || row[`${property}DisableEdit`]) return;
      const rowIndex = this.list.findIndex(x => x === row);
      const editableColumnIndex = this.editPos.marks.findIndex(x => x === property);
      // 设置可编辑单元格索引
      this.setEditPosIndex(rowIndex, editableColumnIndex);
    },
    // 切换行选中列选中状态
    toggleSelectionHandle(row, state) {
      if (this.disabledRows.includes(row)) return;
      // 单选
      if (this.selectionType === 'single' && !this.selectionRows.includes(row)) {
        this.handleSelectionChange([row]);
      }
      // 多选
      if (this.selectionType === 'multiple') {
        this.$refs.appTable.toggleRowSelection(row, state);
      }
    },
    // 单元格双击时
    cellDbclickHandler(row, column, cell, e) {
      const { property } = column;
      if (property === '-' || property === 'column-action') return;
      this.onEnterEvent(row);
    },
    // 设置可编辑单元格索引
    setEditPosIndex(xIndex, yIndex) {
      this.editPos.rowIndex = xIndex < 0 ? 0 : xIndex;
      this.editPos.editableColumnIndex = yIndex < 0 ? 0 : yIndex;
      const { rowIndex, editableColumnIndex, marks } = this.editPos;
      // 如果有上一个处于可编辑状态的，取消
      this.cancelPrevCellEditState();
      // 此列不可编辑
      if (!marks[editableColumnIndex]) return;
      // 设置当前单元格可编辑
      this.setCellEditState(this.list[rowIndex], marks[editableColumnIndex], true);
      // 把当前的单元格设置成上一个
      this.prevHandle = {
        row: this.list[rowIndex],
        key: marks[editableColumnIndex]
      };
      // 获得焦点及选中
      this.$nextTick(() => {
        // 因为 el-table 在列固定的特性下，多了 el-table__fixed 节点，里面的 table 节点完全克隆于 el-table__body-wrapper 中的table 节点，
        // 因此通过 refs 获取到的其实是 el-table__fixed 下的 input，这个节点并不是我们想要的
        // const el = this.$refs[`${rowIndex}|${marks[editableColumnIndex]}`];
        const inputDom = this.tableBody.querySelector(`.input-${rowIndex}-${this.createClassName(marks[editableColumnIndex])} input`);
        if (!inputDom) return;
        inputDom.select();
      });
    },
    // 取消上一个单元格的编辑状态
    cancelPrevCellEditState() {
      const { row, key } = this.prevHandle;
      const { required, searchHelper } = this.actionsLog;
      if (row === null || key === '') return;
      // 不允许为空 非法
      if (required.some(x => x.xUid === row._uid && x.yDataIndex === key)) return;
      // 搜索帮助的值 非法
      if (searchHelper.some(x => x.xUid === row._uid && x.yDataIndex === key)) return;
      // 取消编辑状态
      this.setCellEditState(row, key, false);
      this.prevHandle = { row: null, key: '' };
    },
    // 设置单元格的编辑状态
    setCellEditState(row, dataIndex, state) {
      if (this.editableColumns.find(x => x.dataIndex === dataIndex).defaultEditable) {
        state = true;
      }
      if (row.isNewRow && !state) return;
      this.$set(row, `${dataIndex}IsEdit`, state);
    },
    // 获取格式化后的表格数据
    getFormatData(row, dataIndex) {
      const val = _.get(row, dataIndex, '');
      return _.isNull(val) ? '' : val;
    },
    // 表头的过滤筛选
    filterHandler() {
      if (config.table.serverFilter) {
        this.serverFilter();
      } else {
        this.clientFilter();
      }
    },
    // 服务端过滤筛选
    serverFilter() {
      const params = {};
      for (let attr in this.filters) {
        if (!this.filters[attr].length) continue;
        params[attr.split('|')[1]] = this.filters[attr];
      }
      this.filterParams = params;
      this.toFirstPage();
    },
    // 客户端过滤筛选
    clientFilter() {
      const filterList = [];
      for (let attr in this.filters) {
        const [type, property] = attr.split('|');
        const rows = this.isMemoryPagination ? this.backUpData : this.originData;
        const tmpList = rows.filter(row => {
          const target = this.getFormatData(row, property);
          if (type === 'input' && this.filters[attr] !== '') {
            if (_.isNumber(target)) {
              return !isNaN(Number(this.filters[attr])) && Number(this.filters[attr]) === target;
            } else {
              return target.includes(this.filters[attr]);
            }
          }
          if (type === 'number' && this.filters[attr].length) {
            const [minVal = -Infinity, maxVal = Infinity] = this.filters[attr];
            return target >= Number(minVal) && target <= Number(maxVal);
          }
          if (type === 'radio' && this.filters[attr] !== '') {
            return target === this.filters[attr];
          }
          if (type === 'checkbox' && this.filters[attr].length) {
            // 单元格的值是数组，说明是多选
            if (Array.isArray(target)) {
              return this.filters[attr].every(x => target.includes(x));
            } else {
              return this.filters[attr].includes(target);
            }
          }
          if (type === 'date-range' && this.filters[attr].length) {
            // 是否在时间范围内
            return moment(target).isBetween(this.filters[attr][0], this.filters[attr][1]);
          }
          return true;
        });
        filterList.push(tmpList);
      }
      // 表头筛选条件为空
      if (!Object.keys(this.filters).length) {
        filterList.push(this.isMemoryPagination ? this.backUpData : this.originData);
      }
      // 求给定数组的交集
      const interList = _.intersection(...filterList);
      if (this.isMemoryPagination) {
        this.originData = [...interList];
        this.toFirstPage();
        this.pagination.total = this.originData.length;
        // 处理分页数据
        this.createLimitRecords();
      } else {
        this.list.length = 0;
        this.list.push(...interList);
      }
      // 回显之前表格行选中状态
      this.createRowSelection(this.selectionRows);
      // 取消单元格编辑状态
      this.cancelPrevCellEditState();
    },
    // 表头排序变化时
    sortChangeHandler({ column, prop, order }) {
      if (config.table.serverSort) {
        this.serverSorter(column, prop, order);
      } else {
        this.clientSorter(column, prop, order);
      }
    },
    // 服务端排序
    serverSorter(column, prop, order) {
      const params = {};
      // 升序
      if (order === 'ascending') {
        params.sort = `${prop}|asc`;
      }
      // 降序
      if (order === 'descending') {
        params.sort = `${prop}|desc`;
      }
      this.sorterParams = params;
    },
    // 客户端排序
    clientSorter(column, prop, order) {
      if (order === 'ascending') {
        this.ascSortHandle(this.isMemoryPagination ? this.originData : this.list, prop);
      }
      if (order === 'descending') {
        this.descSortHandle(this.isMemoryPagination ? this.originData : this.list, prop);
      }
      if (order === null) {
        if (this.isMemoryPagination) {
          this.originData = [...this.backUpData];
        } else {
          this.list.length = 0;
          this.list.push(...this.originData);
        }
      }
      if (this.isMemoryPagination) {
        // 处理分页数据
        this.createLimitRecords();
      }
      // 取消单元格编辑状态
      this.cancelPrevCellEditState();
      // 顺序变化后，同步数据
      this.syncTableList();
    },
    // 升序算法
    ascSortHandle(arr, prop) {
      arr.sort((a, b) => {
        a = this.getFormatData(a, prop);
        b = this.getFormatData(b, prop);
        if (!isNaN(Number(a)) && !isNaN(Number(b))) {
          return a - b;
        } else {
          return a.toString().localeCompare(b.toString());
        }
      });
    },
    // 降序算法
    descSortHandle(arr, prop) {
      arr.sort((a, b) => {
        a = this.getFormatData(a, prop);
        b = this.getFormatData(b, prop);
        if (!isNaN(Number(a)) && !isNaN(Number(b))) {
          return b - a;
        } else {
          return b.toString().localeCompare(a.toString());
        }
      });
    },
    // table row 选中状态变化时
    handleSelectionChange(rows) {
      if (Array.isArray(rows)) {
        this.selectionRows = rows;
      } else {
        rows = [rows];
      }
      this.debounce(this.onRowSelectChange, 0)(rows);
    },
    // 清空 table row 的选中
    clearSelectionHandle() {
      this.$refs.appTable.clearSelection();
      if (this.selectionType === 'single') {
        this.handleSelectionChange([]);
      }
    },
    // 设置 table row 行间样式
    tableRowStyle({ row }) {
      const targetRow = this.rowstyles.find(x => x.row === row);
      if (targetRow) {
        return targetRow.styles;
      }
      return '';
    },
    // 切换 table row 类选择器
    tableRowClassName({ row }) {
      if (this.selectionRows.includes(row)) {
        return 'selection-row';
      }
      return '';
    },
    // 设置 table cell 行间样式
    tableCellStyle({ row, column }) {
      const { property = '' } = column;
      const targetCell = this.cellstyles.find(x => x.row === row && x.dataIndex === property);
      if (targetCell) {
        return targetCell.styles;
      }
      return '';
    },
    // 自定义单元格的 class
    tableCellClassName({ column }) {
      const { property = '' } = column;
      return this.createClassName(property);
    },
    // 创建标签类名
    createClassName(dataIndex) {
      return dataIndex.replace(/\./g, '-');
    },
    // 合计功能
    getSummaries(param) {
      const { columns } = param;
      const data = this.isMemoryPagination ? this.originData : this.list;
      const sums = [];
      columns.forEach((column, index) => {
        const { property } = column;
        // 第一列显示合计
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const targetColumn = this.deepFind(this.columns, property);
        // 没有合计的要求
        if (!(targetColumn && targetColumn.summation)) {
          sums[index] = '';
          return;
        }
        const values = data.map(x => {
          return Number(_.get(x, property, 0));
        });
        // 累加求和
        let result = values.reduce((prev, curr) => {
          const value = Number(curr);
          if (!isNaN(value)) {
            return prev + curr;
          } else {
            return prev;
          }
        }, 0);
        // 单位
        const unit = targetColumn.summationUnit ? targetColumn.summationUnit : '';
        // 精度
        const { precision } = targetColumn;
        // 服务端合计
        if (Object.keys(this.summaries).includes(property) && typeof this.summaries[property] !== 'undefined') {
          sums[index] = `${this.summaries[property]} ${unit}`;
        } else {
          result = precision >= 0 ? result.toFixed(precision) : result;
          sums[index] = `${this.formatNumber(result)} ${unit}`;
        }
      });
      return sums;
    },
    // table 头被拖拽改变列宽度
    headerDragendHandler(newWidth, oldWidth, column) {
      const { property } = column;
      if (this.columnsRef) {
        this.$refs.appFilter.SET_COLUMN_INFO({ [property]: newWidth });
      }
      this.$nextTick(() => {
        this.resetRender();
      });
    },
    // 垂直滚动到指定位置
    scrollTopToPosition(t) {
      this.tableBody.parentNode.scrollTop = t;
    },
    // 水平滚动到指定位置
    scrollLeftToPosition(l) {
      this.tableBody.parentNode.scrollLeft = l;
    },
    // 键盘事件处理方法
    keyboardEventHandle(e) {
      let { marks, rowIndex, editableColumnIndex } = this.editPos;
      // 获取 keyCode
      const { keyCode } = e;
      // 没有可编辑列
      if (!marks.length) return;
      const { row } = this.prevHandle;
      // 没有上一个可编辑的单元格
      if (row === null) return;
      // 回车
      if (keyCode === 13) {
        if (e.target.tagName === 'BODY') return;
        this.onEnterEvent(row);
      }
      // 左   右
      if (keyCode === 37 || keyCode === 39) {
        e.preventDefault();
        let yIndex;
        // 处理行编辑索引
        if (keyCode === 37) {
          yIndex = (--editableColumnIndex + marks.length) % marks.length;
        } else {
          yIndex = ++editableColumnIndex % marks.length;
        }
        // 设置可编辑单元格索引
        this.setEditPosIndex(rowIndex, yIndex);
        // 滚动
        this.scrollLeftToPosition(this.tableBody.querySelector(`tbody > tr > .${this.createClassName(marks[yIndex])}`).offsetLeft - 200);
      }
      // 上  下
      if (keyCode === 38 || keyCode === 40) {
        e.preventDefault();
        let xIndex;
        // 处理行编辑索引
        if (keyCode === 38) {
          xIndex = (--rowIndex + this.list.length) % this.list.length;
        } else {
          xIndex = ++rowIndex % this.list.length;
        }
        // 设置可编辑单元格索引
        this.setEditPosIndex(xIndex, editableColumnIndex);
        // 滚动
        this.scrollTopToPosition(this.tableBody.querySelectorAll('tbody > tr')[xIndex].offsetTop);
        // 实现行选中
        if (this.isSelectColumn && this.selectionType === 'single') {
          this.handleSelectionChange([this.list[xIndex]]);
        }
      }
      // Esc 取消
      if (keyCode === 27) {
        // 取消单元格编辑状态
        this.cancelPrevCellEditState();
      }
    },
    // 绑定键盘事件
    bindkeyboardEvent() {
      document.addEventListener('keydown', this.keyboardEventHandle, false);
    },
    // 计算 table 高度，自适应
    calcTableHeight(e) {
      e && e.preventDefault();
      // 不需要自适应
      if (typeof this.height !== 'undefined') return;
      const disY = this.isShowPagination ? 50 : 10;
      const iHeight = window.innerHeight - this.$refs.appTable.$el.getBoundingClientRect().top - disY;
      this.$nextTick(() => {
        this.tableHeight = iHeight < this.minHeight ? this.minHeight : iHeight;
      });
    },
    // 窗口大小变化事件
    bindWindowResizeEvent() {
      window.addEventListener('resize', this.calcTableHeight, false);
    },
    // document 单击事件处理方法
    documentEventHandle(e) {
      const { target } = e;
      // 没有可编辑列
      if (!this.editPos.marks.length) return;
      // DOM 判断
      if (target.tagName === 'BODY' || this.findParents(target, this.tableBody)) return;
      // 取消单元格编辑状态
      this.cancelPrevCellEditState();
    },
    // 绑定 document 单击事件
    bindDocumentEvent() {
      document.addEventListener('click', this.documentEventHandle, false);
    },
    // 查找祖先节点
    findParents(el, parent) {
      let bool = false;
      while (el && el.tagName !== 'BODY') {
        if (el === parent) {
          bool = true;
          break;
        }
        el = el.parentNode;
      }
      return bool;
    },
    // 数字格式化
    formatNumber(value) {
      value += '';
      const list = value.split('.');
      const prefix = list[0].charAt(0) === '-' ? '-' : '';
      let num = prefix ? list[0].slice(1) : list[0];
      let result = '';
      while (num.length > 3) {
        result = `, ${num.slice(-3)}${result}`;
        num = num.slice(0, num.length - 3);
      }
      if (num) {
        result = num + result;
      }
      return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
    },
    // 获取 tableBody 节点
    createTableBody() {
      this.tableBody = this.$refs.appTable.$el.querySelector('.el-table__body');
    },
    // 设置新增行数据的默认值
    setDefaultValue(row) {
      const res = { ...row };
      this.columnFlatMap(this.columns).forEach(column => {
        const { dataIndex, precision, editType } = column;
        _.set(res, dataIndex, this.getFormatData(row, dataIndex));
        const val = _.get(res, dataIndex);
        if (editType === 'number' && precision >= 0 && !isNaN(Number(val))) {
          _.set(res, dataIndex, Number(val).toFixed(precision));
        }
        if (column.editable || column.defaultEditable) {
          this.setCellEditState(res, dataIndex, true);
        }
      });
      return res;
    },
    // 新增行功能
    addRowHandler(rows) {
      rows = Array.isArray(rows) ? rows : [rows];
      rows.forEach(row => {
        if (typeof row !== 'object') return;
        const target = this.setDefaultValue(row);
        // 获取最大 index
        const lastRow = this.originData[this.originData.length - 1];
        const maxIndex = _.isUndefined(lastRow) ? -1 : lastRow.index;
        const newRow = Object.assign({}, target, {
          index: maxIndex + 1,
          _uid: this.createUidKey(),
          isNewRow: true
        });
        this.list.push(newRow);
        this.originData.push(newRow);
        // 内存分页对备份数据的处理
        if (this.isMemoryPagination) {
          this.backUpData.push(newRow);
        }
        // 记录新增行操作
        this.actionsLog.insert.push(newRow);
        // 修改 total 数量
        this.pagination.total += 1;
      });
      if (rows.length && this.list.length) {
        this.$nextTick(() => {
          this.scrollTopToPosition(10000);
        });
      }
    },
    // 重新渲染 table 组件
    resetRender() {
      this.$refs.appTable.doLayout();
    },
    // 数组的深度查找
    deepFind(arr, mark) {
      let res = null;
      for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i].children)) {
          res = this.deepFind(arr[i].children, mark);
        }
        if (res !== null) {
          return res;
        }
        if (arr[i].dataIndex === mark) {
          res = arr[i];
          break;
        }
      }
      return res;
    },
    // 比对两个对象的差异
    difference(newVal, oldVal) {
      const res = {};
      for (let key in newVal) {
        if (!_.isEqual(newVal[key], oldVal[key])) {
          res[key] = newVal[key];
        }
      }
      return res;
    },
    // 获取 column 展平后的一维数组
    columnFlatMap(arr) {
      let res = [];
      arr.forEach(x => {
        let target = { ...x };
        if (Array.isArray(target.children)) {
          res.push(...this.columnFlatMap(target.children));
        }
        delete target.children;
        res.push(target);
      });
      return res;
    },
    // 函数防抖
    debounce(fn, delay) {
      return function(...args) {
        fn.timer && clearTimeout(fn.timer);
        fn.timer = setTimeout(() => fn.apply(this, args), delay);
      };
    },
    // 重新设置记录表格操作的动作
    resetExecuteLog() {
      const { insert, remove } = this.actionsLog;
      // 求 insert, remove 的交集
      const intersections = _.intersection(insert, remove);
      this.actionsLog.insert = insert.filter(x => !intersections.includes(x));
      this.actionsLog.remove = remove.filter(x => !intersections.includes(x));
    },
    // 清除组件的操作记录
    clearTableHandleLog() {
      for (let key in this.actionsLog) {
        this.actionsLog[key] = [];
      }
    },
    // 清空表头筛选条件
    clearTHeadFilters() {
      const { CLEAR_SEARCH_PARAMS } = this.$parent;
      CLEAR_SEARCH_PARAMS && CLEAR_SEARCH_PARAMS();
    },
    // 清空表头排序条件
    clearTHeadSort() {
      this.$refs.appTable.clearSort();
      // 清除表头排序箭头的选中状态
      this.$refs.appTable.columns.forEach(x => (x.order = ''));
    },
    // 表格上方的清空操作
    clearTableHandler() {
      this.clearSelectionHandle();
      this.clearTHeadFilters();
      this.clearTHeadSort();
    },
    // 切换单元的编辑状态
    toggleCellEditableState(rows, callback = () => {}) {
      rows = Array.isArray(rows) ? rows : [rows];
      if (!rows.length) return;
      rows.forEach(row => {
        if (!row._uid) return;
        callback(row);
      });
    },
    // 设置 table 的禁用行
    createDisabledRows(rows) {
      rows = Array.isArray(rows) ? rows : [rows];
      this.disabledRows = rows.filter(x => _.isObject(x));
    },
    // 外部通过组件实例调用的方法
    EXECUTE_INSERT(rows) {
      this.addRowHandler(rows);
    },
    EXECUTE_DELETE(rows) {
      return this.deleteHandler(rows);
    },
    EXECUTE_RESET_HEIGHT() {
      this.calcTableHeight();
    },
    SET_COLUMNS_EDITABLE(dataIndexs, state) {
      dataIndexs = Array.isArray(dataIndexs) ? dataIndexs : [dataIndexs];
      let index = -1;
      dataIndexs.forEach(dataIndex => {
        const column = this.deepFind(this.columns, dataIndex);
        if (!column) return;
        index++;
        // 设置列的默认编辑状态
        column.defaultEditable = Boolean(state);
        const rows = this.isMemoryPagination ? this.originData : this.list;
        // 设置单元格的编辑状态
        rows.forEach(x => this.setCellEditState(x, dataIndex, Boolean(state)));
      });
      if (index !== -1) {
        // 同步组件外 columns，非常重要
        this.onColumnsChange(this.columns);
      }
    },
    SET_CELL_DISABLED(rows, dataIndex, state) {
      if (!dataIndex) return;
      this.toggleCellEditableState(rows, row => {
        this.$set(row, `${dataIndex}Disabled`, Boolean(state));
      });
    },
    SET_CELL_UNEDITABLE(rows, dataIndex, state) {
      if (!dataIndex) return;
      this.toggleCellEditableState(rows, row => {
        this.$set(row, `${dataIndex}DisableEdit`, Boolean(state));
      });
    },
    SET_DISABLE_SELECT(rows) {
      this.createDisabledRows(rows);
    },
    CLEAR_EXECUTE_LOG() {
      this.clearTableHandleLog();
    },
    START_LOADING() {
      this.loading = true;
    },
    STOP_LOADING() {
      this.loading = false;
    },
    GET_UPDATE_ROWS() {
      return this.actionsLog.update;
    },
    GET_INSERT_ROWS() {
      this.resetExecuteLog();
      return this.actionsLog.insert;
    },
    GET_DELETE_ROWS() {
      this.resetExecuteLog();
      return this.actionsLog.remove;
    },
    GET_REQUIRED_ERROR() {
      this.list.forEach(row => {
        this.editableColumns.forEach(column => {
          if (column.editRequired) {
            const val = this.getFormatData(row, column.dataIndex);
            this.validateRequired(column.dataIndex, row._uid, val);
          }
        });
      });
      return this.actionsLog.required.length ? { message: '红色标记单元格的值不允许为空！' } : null;
    },
    GET_SEARCH_HELPER_ERROR() {
      return this.actionsLog.searchHelper.length ? { message: '搜索帮助单元格的值仅支持选择！' } : null;
    }
  },
  render() {
    const { columns, columnsRef, loading, list, selectionRows, isSelectColumn, isShowSummary, isToperInfo, isColumnFilter, isShowPagination, pagination, $slots, $scopedSlots } = this;
    const toperInfoProps = {
      props: { total: pagination.total, selectionRows, isSelectColumn, clearTableHandler: this.clearTableHandler, deleteHandler: this.deleteHandler }
    };
    const columnFilterProps = {
      props: { columns, columnsRef, onColumnsChange: this.onColumnsChange }
    };
    const paginationProps = {
      props: { pagination, onPageChange: this.onPageChange }
    };
    const height = this.height !== 'auto' ? { height: this.tableHeight } : null;
    const maxHeight = this.maxHeight ? { maxHeight: this.maxHeight } : null;
    const tableParams = {
      ref: 'appTable',
      props: {
        size: 'mini',
        border: true,
        ...height,
        ...maxHeight,
        data: list,
        rowKey: record => record._uid,
        rowStyle: this.tableRowStyle,
        rowClassName: this.tableRowClassName,
        cellStyle: this.tableCellStyle,
        cellClassName: this.tableCellClassName,
        showSummary: isShowSummary,
        summaryMethod: this.getSummaries,
        spanMethod: this.mergeCellMethod
      },
      on: {
        'sort-change': this.sortChangeHandler,
        'selection-change': this.handleSelectionChange,
        'cell-click': this.cellClickHandler,
        'cell-dblclick': this.cellDbclickHandler,
        'header-dragend': this.headerDragendHandler
      },
      style: { width: '100%' }
    };
    return (
      <div class="table-wrapper">
        <div class="toper-card">
          <section>
            {isToperInfo && (
              <TopInfo {...toperInfoProps}>
                {Object.keys($slots).map(name => (
                  <template key={name} slot={name}>
                    {$slots[name]}
                  </template>
                ))}
              </TopInfo>
            )}
          </section>
          <section>
            <div class="slot-wrapper">
              {$scopedSlots.controls &&
                $scopedSlots.controls({
                  data: list,
                  methods: { addRecordFunc: this.addRowHandler, delRecordFunc: this.deleteHandler }
                })}
            </div>
            {isColumnFilter && <ColumnFilter ref="appFilter" {...columnFilterProps} />}
          </section>
        </div>
        <Spin spinning={loading} tip="Loading...">
          <el-table {...tableParams}>{this.createColumns(columns)}</el-table>
        </Spin>
        {isShowPagination && <Pagination {...paginationProps} />}
      </div>
    );
  }
};
</script>

<style lang="less">
@tableBgColor: #f2f2f2;
@tableHoverColor: #f5f5f5;
@dangerColor: #f5222d;

.table-wrapper {
  .toper-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: @moduleMargin;
    font-size: 0;
    overflow: hidden;
    .slot-wrapper {
      display: inline-block;
      margin-right: @moduleMargin;
    }
  }
  .el-table__header-wrapper {
    overflow: visible;
    position: relative;
    z-index: 1;
  }
  .el-table__header {
    overflow: visible;
    thead > tr > th {
      overflow: visible;
      height: 40px;
      padding: 0;
      background-color: @tableBgColor !important;
      .cell {
        overflow: visible;
        &.is-required::before {
          content: '*';
          color: @dangerColor;
          margin-right: 4px;
        }
        div {
          line-height: normal;
        }
      }
      &.gutter {
        display: table-cell !important;
      }
    }
  }
  .el-table__body-wrapper {
    z-index: 0;
  }
  .el-table__body {
    tbody > tr > td {
      padding: 2px 0;
    }
    .selection-row {
      background-color: @tableHoverColor;
    }
    .hover-row {
      background-color: @tableHoverColor;
      & > td {
        background: none;
      }
    }
    .el-radio__label {
      display: none;
    }
    .el-date-editor.el-input {
      width: auto;
    }
    .el-form-item {
      margin: 0;
      white-space: pre-wrap;
      overflow: hidden;
      text-overflow: ellipsis;
      /* IE11 */
      display: block\0;
      &.is-error {
        .form-item-error {
          line-height: 1;
          color: @dangerColor;
          text-align: left;
        }
      }
      &::before,
      &::after {
        font-size: 0;
        line-height: 0;
      }
    }
  }
  .el-table__footer {
    tbody > tr > td {
      height: 32px;
      padding: 0;
      background-color: @tableBgColor !important;
    }
  }
  .el-table__fixed {
    z-index: 1;
    &::before {
      background-color: @borderColor;
    }
  }
}
.autocomplete {
  min-width: 200px;
  width: auto !important;
  .el-autocomplete-suggestion__wrap {
    ul {
      width: 100%;
      display: table;
      li {
        display: table-row;
        line-height: 30px;
        font-size: 12px;
        td {
          span {
            padding: 0 10px;
          }
          &:first-child span {
            padding-left: 20px;
          }
          &:last-child span {
            padding-right: 20px;
          }
        }
        &.highlighted,
        &:hover {
          background-color: #f5f5f5;
        }
      }
    }
  }
}
.dropdown-list {
  min-width: 96px;
  li > span {
    display: block;
    margin: 0 -15px;
    padding: 0 15px;
  }
}
</style>
