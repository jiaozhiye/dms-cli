<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-05-06 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-05-07 11:00:00
 **/
import _ from 'lodash';
import moment from 'moment';
import config from '@/config';
import { mergeProps, getOptionProps } from '@/utils/props-util';
import ColumnFilter from './columnFilter';
import Pagination from './pagination';

export default {
  name: 'page-table',
  props: {
    height: {
      type: [Number, String]
    },
    columns: {
      type: Array,
      required: true,
      default() {
        return [];
      }
    },
    columnsRef: {
      type: String,
      default: ''
    },
    dataSource: {
      type: [Array, Object],
      default() {
        return [];
      }
    },
    fetchapi: Function,
    params: {
      type: Object,
      default() {
        return {};
      }
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
      default() {
        return [];
      }
    },
    cellstyles: {
      type: Array,
      default() {
        return [];
      }
    },
    selectionType: {
      type: String,
      default: 'multiple'
    },
    defaultSelections: {
      type: Array,
      default() {
        return [];
      }
    },
    filters: {
      type: Object,
      default() {
        return {};
      }
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
      tableHeight: Number(this.height) || this.minHeight, // 高度
      selectionRows: [], // table 选中行
      filterParams: {}, // 表头筛选参数
      sorterParams: {}, // 表头排序参数
      columnInfo: {}, // table column 信息
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
      }
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
    isMultilevelHeader() {
      return this.columns.some(x => Array.isArray(x.children) && x.children.length);
    },
    fetchParams() {
      const { current, pageSize } = this.pagination;
      const pagination = this.isShowPagination ? { pageNum: current, currentPage: current, pageSize, limit: pageSize } : {};
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
    visibleColumns() {
      return this.columns.filter(x => !x.hidden).length;
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
      this.tableHeight = Number(nextProps);
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
    visibleColumns() {
      // Element-UI v2.10.x 及以上的版本，在切换表格列显示/隐藏状态时，特别是最后一列，可能会出现 tr 对不齐的 bug
      this.$nextTick(() => this.$refs.appTable.doLayout());
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
      selectedRows.forEach(row => this.$refs.appTable.toggleRowSelection(row, true));
    },
    // 创建内存分页的列表数据
    createLimitRecords() {
      const { current, pageSize } = this.pagination;
      this.list = this.originData.slice((current - 1) * pageSize, current * pageSize);
    },
    // 是否仅有分页参数产生变化
    isOnlyPageChange(nextProps, prevProps) {
      const diff = Object.keys(this.difference(nextProps, prevProps)).join('|');
      return diff === 'pageNum|currentPage' || diff === 'pageSize|limit';
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
      this.syncTableList();
      // 总记录数
      let totalRow = 0;
      if (Array.isArray(data)) {
        totalRow = data.length;
      } else if (keypath.lastIndexOf('.') !== -1) {
        totalRow = _.get(data, keypath.slice(0, keypath.lastIndexOf('.')), {}).total || 0;
      } else {
        totalRow = data.total || 0;
      }
      this.pagination.total = totalRow;
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
      });
    },
    // 处理列表数据
    createTableDataKey(dataList, uidkey) {
      dataList.forEach((x, i) => {
        x.index = i; // 序号
        x._uid = x[uidkey] || this.createUidKey(); // 字段值唯一不重复的 key
        // 处理数值类型的可编辑单元格，显示数据的精度
        this.editableColumns.forEach(column => {
          let { dataIndex, precision = 2 } = column;
          if (_.isUndefined(_.get(x, dataIndex))) {
            _.set(x, dataIndex, '');
          }
          if (column.editType === 'number') {
            if (!isNaN(Number(x[dataIndex]))) {
              x[dataIndex] = Number(x[dataIndex]).toFixed(precision);
            }
          }
          // 单元格默认为不可编辑状态
          this.setCellEditState(x, dataIndex, false);
        });
      });
      return dataList;
    },
    // 同步组件数据列表
    syncTableList() {
      const rows = this.isMemoryPagination ? this.originData : this.list;
      // 重置组件数据列表的索引
      rows.forEach((row, i) => (row.$index = i));
      this.onSyncTableData(rows);
    },
    // 跳转到第一页
    toFirstPage() {
      this.pagination.current = 1;
    },
    // 单元格编辑后的渲染方法
    editedScopedRender(column, props) {
      let res = _.get(props.row, column.dataIndex);
      if (column.editType === 'select' || column.editType === 'select-multiple') {
        if (Array.isArray(column.editItems) && column.editItems.length) {
          res = Array.isArray(res) ? res : [res];
          res = column.editItems
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
      const { dataIndex } = column;
      const prevValue = _.get(props.row, dataIndex);
      if (column.editType === 'select' || column.editType === 'select-multiple') {
        return (
          <el-select
            size="mini"
            multiple={column.editType === 'select-multiple'}
            value={prevValue}
            onInput={val => _.set(props.row, dataIndex, val)}
            placeholder="请选择"
            disabled={column.disabled || props.row.isDisabled}
            onChange={value => {
              this.editCellChangeHandle(value, props.row._uid, dataIndex);
            }}
          >
            {Array.isArray(column.editItems) && column.editItems.map(item => <el-option key={item.value} label={item.text} value={item.value} />)}
          </el-select>
        );
      }
      if (column.editType === 'date-picker') {
        const { dateFormat = 'yyyy-MM-dd' } = column;
        const dateType = dateFormat === 'yyyy-MM-dd HH:mm:ss' ? 'datetime' : 'date';
        return (
          <el-date-picker
            size="mini"
            value={prevValue}
            onInput={val => _.set(props.row, dataIndex, val)}
            type={dateType}
            clearable={false}
            placeholder="选择日期"
            format={dateFormat}
            value-format="yyyy-MM-dd HH:mm:ss"
            disabled={column.disabled || props.row.isDisabled}
            onChange={value => {
              this.editCellChangeHandle(value, props.row._uid, dataIndex);
            }}
          />
        );
      }
      // 校验数字的正则
      const numberReg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
      // 默认精度是两位
      const { precision = 2 } = column;
      return (
        <el-input
          class={`input-${props.$index}-${this.createClassName(dataIndex)}`}
          size="mini"
          maxlength={column.maxlength}
          value={prevValue}
          disabled={column.disabled || props.row.isDisabled}
          onInput={val => {
            // 单元格正则校验
            if (_.isRegExp(column.editPattern)) {
              // 是否为删除动作
              let isRemoveHandle = val.length < (prevValue && prevValue.length);
              // 单元格正则校验
              if (!isRemoveHandle && !column.editPattern.test(val)) return;
            }
            // 数值类型的校验
            if (column.editType === 'number') {
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
            if (column.editType === 'number') {
              value = this.parseNumber(value, precision);
            }
            this.editCellChangeHandle(value, props.row._uid, dataIndex);
          }}
          onBlur={e => {
            const { value } = e.target;
            if (column.editType === 'number') {
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
      const prevValue = _.get(props.row, dataIndex);
      return (
        <el-autocomplete
          class={`input-${props.$index}-${this.createClassName(dataIndex)}`}
          size="mini"
          popper-class="autocomplete"
          maxlength={column.maxlength}
          style={{ width: '100%' }}
          value={prevValue}
          disabled={column.disabled || props.row.isDisabled}
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
      const classNames = !msgs.length ? 'el-form-item' : 'el-form-item is-error';
      const domStyle = isTooltip ? { whiteSpace: 'pre' } : null;
      return (
        <div class={classNames} style={domStyle}>
          {JSXNode}
          {msgs.map(msg => (
            <div class="form-item-error">{msg}</div>
          ))}
        </div>
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
        <el-table-column key="-" prop="-" type="selection" reserveSelection={true} fixed="left" width="50" />
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
      return f * l + 60;
    },
    // 格式化数值类型
    parseNumber(value, n) {
      // '.' 在最后或者仅有一个字符 '-'
      if (value.charAt(value.length - 1) === '.' || value === '-') {
        value = value.slice(0, -1);
      }
      return value !== '' ? Number(value).toFixed(n) : '';
    },
    // 金融格式数字的格式化方法
    numberFormat(column, input) {
      if (column.numberFormat) {
        input = this.formatNumber(input);
      }
      return input;
    },
    // 日期的格式化方法
    dateFormat(column, input) {
      if (typeof column.dateFormat !== 'undefined') {
        const dateFormat = column.dateFormat.replace('yyyy-MM-dd', 'YYYY-MM-DD');
        const dateVal = moment(input).format(dateFormat);
        input = dateVal === 'Invalid date' ? input : dateVal;
      }
      return input;
    },
    // 组装搜索帮助数据列表
    createSerachHelperList(arr, aliasKey) {
      const allColumns = this.columnFlatMap(this.columns);
      return arr.map(x => {
        const item = {};
        for (let attr in x) {
          if (Object.keys(aliasKey).includes(attr)) {
            let { dataIndex } = aliasKey[attr];
            let column = allColumns.find(x => x.dataIndex === dataIndex);
            // 处理数值类型的可编辑单元格，显示数据的精度
            if (column.editType === 'number') {
              let { precision = 2 } = column;
              if (!isNaN(Number(x[attr]))) {
                item[dataIndex] = Number(x[attr]).toFixed(precision);
              }
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
        this.setCellEditState(this.list.find(x => x._uid === uid), dataIndex, true);
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
      this.onCellChange({ [`${uid}|${key}`]: val }, this.list.find(x => x._uid === uid));
    },
    // ajax 获取搜索帮助服务端数据
    async querySearchAsync(column, row, queryString = '', cb) {
      const {
        dataIndex,
        searchHelper: { fetchApi, params = {}, datakey = '', aliasKey }
      } = column;
      // 搜索帮助数据的 key
      const key = Object.entries(aliasKey).find(x => x[1].dataIndex === dataIndex)[0];
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
        this.loading = true;
        const params = { ...this.fetchParams };
        // 移除 xhrAbort 属性
        delete params.xhrAbort;
        try {
          const res = await this.fetchapi(params);
          if (res.resultCode === 200) {
            // 构建表格数据
            this.createTableList(res.data);
          }
        } catch (e) {
          this.createTableList({});
        }
        this.loading = false;
      }
    },
    // 移除数组中的记录
    removeItemHandle(arr, item) {
      arr.splice(arr.findIndex(x => x === item), 1);
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
    cellClickHandler(row, column, cell, e) {
      const { property } = column;
      if (this.isSelectColumn && property !== 'column-action') {
        // 单击可选择列 或 表格不可编辑
        if (property === '-' || !this.isEditable) {
          this.toggleSelectionHandle(row);
        } else if (this.selectionType === 'single') {
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
    toggleSelectionHandle(row) {
      // 单选
      if (this.selectionType === 'single' && !this.selectionRows.includes(row)) {
        this.handleSelectionChange([row]);
      }
      // 多选
      if (this.selectionType === 'multiple') {
        this.$refs.appTable.toggleRowSelection(row);
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
          const target = _.get(row, property, '');
          if (_.isNull(target)) {
            return false;
          }
          if (type === 'input' && this.filters[attr] !== '') {
            if (typeof target === 'number') {
              return !isNaN(Number(this.filters[attr])) && Number(this.filters[attr]) === target;
            } else {
              return target.includes(this.filters[attr]);
            }
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
        a = _.get(a, prop, '');
        b = _.get(b, prop, '');
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
        a = _.get(a, prop, '');
        b = _.get(b, prop, '');
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
        const result = values.reduce((prev, curr) => {
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
        const { summationPrecision = 2 } = targetColumn;
        sums[index] = `${this.formatNumber(result.toFixed(summationPrecision))} ${unit}`;
      });
      return sums;
    },
    // table 头被拖拽改变列宽度
    headerDragendHandler(newWidth, oldWidth, column) {
      const { property } = column;
      if (!this.columnsRef) return;
      this.columnInfo = { [property]: newWidth };
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
      this.tableHeight = iHeight < this.minHeight ? this.minHeight : iHeight;
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
      let res = {};
      this.columnFlatMap(this.columns).forEach(x => {
        _.set(res, x.dataIndex, '');
        if (Object.keys(row).includes(`${x.dataIndex}IsEdit`)) {
          delete row[`${x.dataIndex}IsEdit`];
        }
        if (x.editable || x.editType) {
          // 新增的行默认为可编辑
          this.setCellEditState(res, x.dataIndex, true);
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
        const newRow = Object.assign({}, target, row, {
          index: maxIndex + 1,
          _uid: this.createUidKey('new'),
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
    SET_CELL_UNEDITABLE(rows, dataIndex, state) {
      rows = Array.isArray(rows) ? rows : [rows];
      rows.forEach(row => {
        if (!row._uid) return;
        // 强制该单元格不可编辑
        this.$set(row, `${dataIndex}DisableEdit`, Boolean(state));
      });
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
            let val = _.get(row, column.dataIndex) || '';
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
  mounted() {
    this.createTableList(this.dataSource);
    this.createRowSelection(this.defaultSelections);
    this.getTableData();
    this.createTableBody();
    this.bindWindowResizeEvent();
    this.bindkeyboardEvent();
    this.bindDocumentEvent();
    this.$nextTick(this.calcTableHeight);
  },
  beforeDestroy() {
    // 解绑事件，防止内存泄漏
    window.removeEventListener('resize', this.calcTableHeight);
    document.removeEventListener('keydown', this.keyboardEventHandle);
    document.removeEventListener('click', this.documentEventHandle);
  },
  render() {
    const {
      columns,
      columnsRef,
      columnInfo,
      loading,
      list,
      height,
      tableHeight,
      selectionRows,
      isSelectColumn,
      isShowSummary,
      isToperInfo,
      isColumnFilter,
      isShowPagination,
      pagination,
      $slots,
      $scopedSlots
    } = this;
    const toperInfoProps = {
      props: { total: pagination.total, selectionRows, isSelectColumn, clearTableHandler: this.clearTableHandler, deleteHandler: this.deleteHandler }
    };
    const columnFilterProps = {
      props: { columns, columnsRef, columnInfo, onColumnsChange: this.onColumnsChange }
    };
    const paginationProps = {
      props: { pagination, onPageChange: this.onPageChange }
    };
    return (
      <div class="table-wrapper">
        <div class="toper-card">
          <section>
            {isToperInfo && (
              <toper-info {...toperInfoProps}>
                {Object.keys($slots).map(name => (
                  <template key={name} slot={name}>
                    {$slots[name]}
                  </template>
                ))}
              </toper-info>
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
            {isColumnFilter && <ColumnFilter {...columnFilterProps} style={{ marginRight: '10px' }} />}
          </section>
        </div>
        <el-table
          ref="appTable"
          size="mini"
          border
          height={height !== 'auto' ? tableHeight : height}
          style={{ width: '100%' }}
          data={list}
          row-key={record => record._uid}
          v-loading={loading}
          header-row-class-name="table-header"
          row-style={this.tableRowStyle}
          row-class-name={this.tableRowClassName}
          cell-style={this.tableCellStyle}
          cell-class-name={this.tableCellClassName}
          show-summary={isShowSummary}
          summary-method={this.getSummaries}
          span-method={this.mergeCellMethod}
          on-sort-change={this.sortChangeHandler}
          on-selection-change={this.handleSelectionChange}
          on-cell-click={this.cellClickHandler}
          on-cell-dblclick={this.cellDbclickHandler}
          on-header-dragend={this.headerDragendHandler}
        >
          {this.createColumns(columns)}
        </el-table>
        {isShowPagination && <Pagination {...paginationProps} />}
      </div>
    );
  },
  components: {
    ToperInfo: {
      props: ['total', 'selectionRows', 'isSelectColumn', 'clearTableHandler'],
      render() {
        return (
          <div class="info">
            <el-alert class="alert" closable={false} type="info" show-icon>
              <span class="text" slot="title">
                总共 <i>{this.total}</i> 条数据
                {this.isSelectColumn ? (
                  <span>
                    ，已选择 <i>{this.selectionRows.length}</i> 项
                    <el-button size="small" type="text" style={{ marginLeft: '10px' }} onClick={this.clearTableHandler}>
                      清空
                    </el-button>
                  </span>
                ) : null}
              </span>
            </el-alert>
            {Array.isArray(this.$slots.moreActions) && this.selectionRows.length ? (
              <el-dropdown size="small" style={{ marginLeft: '10px' }} placement="bottom-start">
                <el-button size="small">
                  更多操作
                  <i class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <el-dropdown-menu slot="dropdown" class="dropdown-list">
                  {this.$slots.moreActions
                    .filter(x => x.tag)
                    .map((x, i) => (
                      <el-dropdown-item key={i}>{x}</el-dropdown-item>
                    ))}
                </el-dropdown-menu>
              </el-dropdown>
            ) : null}
          </div>
        );
      }
    }
  }
};
</script>

<style lang="less">
// @primaryColor: #bb0a30;
@tableBgColor: #f2f2f2;
@tableHoverColor: #f5f5f5;
@dangerColor: #f5222d;

.table-wrapper {
  .toper-card {
    font-size: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    overflow: hidden;
    .info {
      display: flex;
    }
    .alert {
      height: 32px;
      padding: 0 12px 0 10px;
      background-color: @tableBgColor;
      border: 1px solid #d9d9d9;
      .el-icon-info {
        color: @primaryColor;
      }
      .el-alert__content {
        display: flex;
        padding-left: 6px;
        padding-right: 0;
        .text {
          font-size: 12px;
          i {
            font-size: 13px;
            font-weight: 600;
            color: @primaryColor;
            font-style: normal;
          }
        }
      }
    }
    .slot-wrapper {
      display: inline-block;
      margin-right: 10px;
    }
  }
  .el-table th.gutter {
    display: table-cell !important;
  }
  .el-table__header {
    thead > tr > th {
      background: none;
    }
  }
  .el-table__body {
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
    }
    .is-error {
      .form-item-error {
        line-height: 1;
        color: @dangerColor;
        text-align: left;
      }
    }
  }
  .el-table__footer {
    tbody > tr > td {
      background-color: @tableBgColor !important;
    }
  }
  .table-header {
    th {
      background-color: @tableBgColor !important;
      .cell {
        &.is-required::before {
          content: '*';
          color: @dangerColor;
          margin-right: 4px;
        }
      }
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
          background-color: @tableHoverColor;
        }
      }
    }
  }
}
.dropdown-list {
  li > span {
    display: block;
    margin: 0 -15px;
    padding: 0 15px;
  }
}
</style>
