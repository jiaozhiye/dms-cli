<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-05-06 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-05-07 11:00:00
 **/
import _ from 'lodash';
import { mergeProps, getOptionProps } from '@/utils/props-util';
import PageTable from './pageTable.vue';

export default {
  name: 'filter-table',
  props: {
    height: {
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
    isSelectColumn: {
      type: Boolean,
      default: true
    },
    defaultSelections: {
      type: Array,
      default: () => []
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
    this.$pageTable = null;
    this.isColumnsChange = false;
    this.arrayTypes = ['checkbox', 'number', 'date-range'];
    return {
      visible: this.createVisibleData(this.columns),
      search: this.createSearchData(this.columns),
      filters: {}
    };
  },
  computed: {
    columnKeysChange() {
      return this.columns
        .filter(x => !x.hidden)
        .map(x => x.dataIndex)
        .join('|');
    }
  },
  watch: {
    columnKeysChange() {
      this.isColumnsChange = true;
    }
  },
  methods: {
    createVisibleData(columns) {
      let target = {};
      columns.forEach(x => {
        if (Array.isArray(x.children)) {
          Object.assign(target, this.createVisibleData(x.children));
        }
        if (x.filter) {
          target[x.dataIndex] = false;
        }
      });
      return target;
    },
    createSearchData(columns) {
      let target = {};
      columns.forEach(x => {
        let { filter, filterType } = x;
        if (Array.isArray(x.children)) {
          Object.assign(target, this.createSearchData(x.children));
        }
        if (filter && this.arrayTypes.includes(filterType)) {
          target[`${x.dataIndex}Val`] = [];
        }
      });
      return target;
    },
    createFilterColumns(columns) {
      const filterColumns = columns.map(column => {
        let target = { ...column };
        if (Array.isArray(column.children) && column.children.length > 0) {
          // 递归
          target.children = this.createFilterColumns(column.children);
        }
        // 设置 column hideen 属性
        if (typeof column.hidden === 'undefined') {
          target.hidden = false;
        }
        // 没有开启筛选
        if (!column.filter) {
          return target;
        }
        // 合并对象
        const filterProps = this.getColumnSearchProps();
        return { ...target, ...filterProps };
      });
      // 筛选 展示/隐藏 字段
      return filterColumns;
    },
    getColumnSearchProps() {
      return {
        renderHeader: this.renderHeaderHandle
      };
    },
    // 自定义实现过滤
    filterHandler(property, type, val) {
      if (typeof val !== 'undefined') {
        this.search[`${property}Val`] = val;
      }
      this.filters = Object.assign({}, this.filters, {
        [`${type}|${property}`]: this.search[`${property}Val`]
      });
      this.closeAllPopover();
    },
    // 关闭所有筛选面板
    closeAllPopover(property) {
      for (let attr in this.$refs) {
        if (attr === property) continue;
        if (this.$refs[attr] && this.$refs[attr].doClose) {
          this.visible[attr] = false;
          this.$refs[attr].doClose();
        }
      }
    },
    // 打开当前的筛选面板
    showCurrentPopover(target, property) {
      if (this.visible[property]) return;
      this.visible[property] = true;
      this.$refs[property].doShow();
      setTimeout(() => {
        // 诡异的问题，还是因为固定列，克隆节点的问题
        if (this.isColumnsChange) {
          this.resetPopoverPos(this.$refs[property].$el.querySelector('.el-popover__reference').getAttribute('aria-describedby'), target);
        }
      }, 0);
    },
    // 重置筛选面板的位置
    resetPopoverPos(id, target) {
      const $el = document.getElementById(id);
      let iLeft = target.getBoundingClientRect().left;
      if (iLeft < 0) {
        iLeft = 0;
      }
      if (iLeft > window.innerWidth - $el.offsetWidth) {
        iLeft = window.innerWidth - $el.offsetWidth - 4;
      }
      $el.style.left = `${iLeft}px`;
    },
    // 创建头部筛选节点
    createToperNode(label = '', property) {
      return (
        <span
          slot="reference"
          style={{ padding: '5px 2px 2px 10px', marginLeft: '-10px' }}
          onClick={e => {
            e.stopPropagation();
            this.closeAllPopover(property);
            this.showCurrentPopover(e.target, property);
          }}
        >
          <span style="pointer-events: none" class={this.isValueFalse(this.search[`${property}Val`]) ? '' : 'topFilterSelected'}>
            {label} <i class="el-icon-arrow-down" />
          </span>
        </span>
      );
    },
    // 创建底部按钮节点
    createButtonNode(type, property, val) {
      return (
        <div style={{ paddingBottom: 0, marginTop: '10px' }}>
          <el-button type="primary" size="mini" disabled={this.isValueFalse(this.search[`${property}Val`])} onClick={e => this.filterHandler(property, type)}>
            搜索
          </el-button>
          <el-button size="mini" onClick={e => this.filterHandler(property, type, val)}>
            重置
          </el-button>
        </div>
      );
    },
    // 表格头部渲染
    renderHeaderHandle({ column, $index }, type) {
      const { property, label } = column;
      // 查找对应的表头列 column
      const originColumn = this.deepFind(this.columns, property);
      return originColumn && originColumn.filterType === type ? (
        <el-popover
          ref={property}
          trigger="manual"
          visibleArrow={false}
          popperClass="popper-wrap"
          placement="bottom-start"
          // value={this.visible[property]}
        >
          {this.createToperNode(label, property)}
          <div class="el-table-filter__content">{this[`${type}Handle`] && this[`${type}Handle`](originColumn)}</div>
          {this.createButtonNode(type, property, this.arrayTypes.includes(type) ? [] : '')}
        </el-popover>
      ) : null;
    },
    inputHandle(column) {
      const { dataIndex, title, filterType } = column;
      return (
        <el-input
          v-model={this.search[`${dataIndex}Val`]}
          placeholder={`搜索${title}`}
          nativeOnKeydown={e => {
            e.stopPropagation();
            if (e.keyCode === 13) {
              this.filterHandler(dataIndex, filterType);
            }
          }}
        />
      );
    },
    numberHandle(column) {
      const { dataIndex, precision, filterType } = column;
      const [startVal, endVal] = this.search[`${dataIndex}Val`];
      const setValue = arr => {
        this.search[`${dataIndex}Val`] = arr.map(x => (x !== '' ? x : undefined));
      };
      return (
        <div>
          <el-input
            value={this.search[`${dataIndex}Val`][0]}
            onInput={val => {
              if (!this.validateNumber(val)) return;
              setValue([val, this.search[`${dataIndex}Val`][1]]);
            }}
            style={{ width: '100px' }}
            placeholder="开始值"
            onChange={val => {
              if (val !== '' && val > endVal) {
                setValue([endVal, this.search[`${dataIndex}Val`][1]]);
              }
            }}
            nativeOnKeydown={e => {
              e.stopPropagation();
              if (e.keyCode === 13) {
                this.filterHandler(dataIndex, filterType);
              }
            }}
          />
          <span style="display: inline-block; text-align: center; width: 14px;">-</span>
          <el-input
            value={this.search[`${dataIndex}Val`][1]}
            onInput={val => {
              if (!this.validateNumber(val)) return;
              setValue([this.search[`${dataIndex}Val`][0], val]);
            }}
            min={startVal}
            style={{ width: '100px' }}
            placeholder="结束值"
            onChange={val => {
              if (val !== '' && val < startVal) {
                setValue([this.search[`${dataIndex}Val`][0], startVal]);
              }
            }}
            nativeOnKeydown={e => {
              e.stopPropagation();
              if (e.keyCode === 13) {
                this.filterHandler(dataIndex, filterType);
              }
            }}
          />
        </div>
      );
    },
    checkboxHandle(column) {
      const { dataIndex, filterItems = [] } = column;
      return (
        <el-checkbox-group v-model={this.search[`${dataIndex}Val`]}>
          {filterItems.map(x => (
            <li key={x.value} style={{ marginBottom: '7px' }}>
              <el-checkbox label={x.value}>{x.text}</el-checkbox>
            </li>
          ))}
        </el-checkbox-group>
      );
    },
    radioHandle(column) {
      const { dataIndex, filterItems = [] } = column;
      return (
        <el-radio-group v-model={this.search[`${dataIndex}Val`]} style={{ display: 'block' }}>
          {filterItems.map(x => (
            <li key={x.value} style={{ marginBottom: '8px' }}>
              <el-radio label={x.value}>{x.text}</el-radio>
            </li>
          ))}
        </el-radio-group>
      );
    },
    ['date-rangeHandle'](column) {
      const { dataIndex } = column;
      return (
        <el-date-picker
          size="small"
          type="daterange"
          v-model={this.search[`${dataIndex}Val`]}
          unlink-panels={true}
          style={{ width: '215px' }}
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      );
    },
    documentEventHandle(e) {
      this.closeAllPopover();
    },
    // 参数值是否是假，假 -> 返回 ture
    isValueFalse(val) {
      if (Array.isArray(val)) {
        return !val.filter(x => !_.isUndefined(x)).length;
      }
      return !val;
    },
    // 数值类型值得校验
    validateNumber(val) {
      const numberReg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
      return (!Number.isNaN(val) && numberReg.test(val)) || val === '' || val === '-';
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
    CLEAR_SEARCH_PARAMS() {
      this.filters = {};
      this.search = this.createSearchData(this.columns);
    },
    // PageTable 组件对外公开的方法
    EXECUTE_INSERT(...rest) {
      this.$pageTable.EXECUTE_INSERT(...rest);
    },
    EXECUTE_DELETE(...rest) {
      return this.$pageTable.EXECUTE_DELETE(...rest);
    },
    EXECUTE_RESET_HEIGHT() {
      this.$pageTable.EXECUTE_RESET_HEIGHT();
    },
    SET_COLUMNS_EDITABLE(...rest) {
      this.$pageTable.SET_COLUMNS_EDITABLE(...rest);
    },
    SET_CELL_DISABLED(...rest) {
      this.$pageTable.SET_CELL_DISABLED(...rest);
    },
    SET_CELL_UNEDITABLE(...rest) {
      this.$pageTable.SET_CELL_UNEDITABLE(...rest);
    },
    SET_DISABLE_SELECT(...rest) {
      this.$pageTable.SET_DISABLE_SELECT(...rest);
    },
    CLEAR_EXECUTE_LOG() {
      this.$pageTable.CLEAR_EXECUTE_LOG();
    },
    START_LOADING() {
      this.$pageTable.START_LOADING();
    },
    STOP_LOADING() {
      this.$pageTable.STOP_LOADING();
    },
    GET_UPDATE_ROWS() {
      return this.$pageTable.GET_UPDATE_ROWS();
    },
    GET_INSERT_ROWS() {
      return this.$pageTable.GET_INSERT_ROWS();
    },
    GET_DELETE_ROWS() {
      return this.$pageTable.GET_DELETE_ROWS();
    },
    GET_REQUIRED_ERROR() {
      return this.$pageTable.GET_REQUIRED_ERROR();
    },
    GET_SEARCH_HELPER_ERROR() {
      return this.$pageTable.GET_SEARCH_HELPER_ERROR();
    }
  },
  mounted() {
    this.$pageTable = this.$refs.pageTable;
    document.addEventListener('click', this.documentEventHandle, false);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.documentEventHandle);
  },
  render() {
    const { $listeners, $slots, $attrs, $scopedSlots } = this;
    const props = getOptionProps(this);
    const wrapProps = mergeProps({
      props: {
        ...props,
        filters: this.filters,
        columns: this.createFilterColumns(this.columns)
      },
      on: $listeners,
      attrs: $attrs,
      scopedSlots: $scopedSlots
    });
    return (
      <PageTable ref="pageTable" {...wrapProps}>
        {Object.keys($slots).map(name => (
          <template key={name} slot={name}>
            {$slots[name]}
          </template>
        ))}
      </PageTable>
    );
  }
};
</script>

<style lang="less">
// @primaryColor: #bb0a30;

.popper-wrap {
  min-width: 120px !important;
  .el-input__inner {
    text-align: left !important;
  }
  .el-checkbox {
    width: 100%;
  }
  .el-radio {
    width: 100%;
  }
}
.topFilterSelected {
  color: @primaryColor;
}
</style>
