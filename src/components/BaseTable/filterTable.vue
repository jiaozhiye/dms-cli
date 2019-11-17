<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-11-12 09:46:23
 **/
import _ from 'lodash';
import { mergeProps, getOptionProps } from '@/utils/props-util';
import PageTable from './pageTable.vue';
import DropDown from './dropDown.vue';

export default {
  name: 'FilterTable',
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
    onSummationChange: {
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
    this.scrollLeft = 0;
    this.arrayTypes = ['checkbox', 'number', 'date-range'];
    return {
      visible: this.createVisibleData(this.columns),
      search: this.createSearchData(this.columns),
      offset: this.createPanelOffset(this.columns),
      filters: {}
    };
  },
  mounted() {
    // 获取 DOM 节点
    this.$pageTable = this.$refs.pageTable;
    this.$$tablebody = this.$pageTable.$el.querySelector('.el-table__body-wrapper');
    this.$$tableHeader = this.$pageTable.$el.querySelector('.el-table__header-wrapper > .el-table__header');
    // 事件绑定
    this.$$tablebody.addEventListener('scroll', this.scrollEventHandle, false);
    document.addEventListener('click', this.documentEventHandle, false);
  },
  beforeDestroy() {
    this.$$tablebody.removeEventListener('scroll', this.scrollEventHandle);
    document.removeEventListener('click', this.documentEventHandle);
    this.$$tablebody = null;
    this.$$tableHeader = null;
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
    createPanelOffset(columns) {
      let target = {};
      columns.forEach(x => {
        if (Array.isArray(x.children)) {
          Object.assign(target, this.createVisibleData(x.children));
        }
        if (x.filter) {
          target[x.dataIndex] = 0;
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
      for (let key in this.visible) {
        if (key === property) continue;
        this.visible[key] = false;
        this.offset[key] = 0;
      }
    },
    // 打开当前的筛选面板
    openCurPopover(el, property) {
      this.visible[property] = true;
      this.offset[property] = this.getOffsetLeft(el, this.$$tableHeader.parentNode) - this.scrollLeft;
      this.$nextTick(() => this.removePopperHandle(el));
    },
    // 移除由于固定列，element-ui 克隆 table 节点带来的多余 popper 节点
    removePopperHandle(el) {
      const $nodes = Array.from(document.body.querySelectorAll('.thead-popper'));
      if (!$nodes.length) return;
      const $id = el.getAttribute('aria-describedby');
      $nodes.forEach(x => {
        if (x.getAttribute('id') === $id) return;
        x.parentNode.removeChild(x);
      });
    },
    // 创建头部筛选节点
    createToperNode(label = '', property) {
      return (
        <span
          slot="reference"
          style={{ paddingLeft: '10px', lineHeight: '34px' }}
          onClick={e => {
            e.stopPropagation();
            this.closeAllPopover(property);
            this.openCurPopover(e.target, property);
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
        <div class="popover-bottom">
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
      const DropDownNode = (
        <DropDown
          visible={this.visible[property]}
          placement="left"
          style={{ marginLeft: '-10px' }}
          offsetLeft={this.offset[property]}
          boundariesElement={this.$pageTable.$el}
          containerStyle={{ marginTop: '4px', padding: '10px' }}
        >
          {this.createToperNode(label, property)}
          <template slot="content">
            <div class="popover-wrap">{this[`${type}Handle`] && this[`${type}Handle`](originColumn)}</div>
            {this.createButtonNode(type, property, this.arrayTypes.includes(type) ? [] : '')}
          </template>
        </DropDown>
      );
      const PopoverNode = (
        <el-popover
          popper-class="thead-popper"
          value={this.visible[property]}
          trigger="manual"
          style={{ display: 'inline-flex', marginLeft: '-10px' }}
          visibleArrow={false}
          transition="el-zoom-in-top"
          placement="bottom-start"
        >
          {this.createToperNode(label, property)}
          <template slot="default">
            <div class="popover-wrap">{this[`${type}Handle`] && this[`${type}Handle`](originColumn)}</div>
            {this.createButtonNode(type, property, this.arrayTypes.includes(type) ? [] : '')}
          </template>
        </el-popover>
      );
      return originColumn && originColumn.filterType === type ? (originColumn.fixed ? PopoverNode : DropDownNode) : null;
    },
    inputHandle(column) {
      const { dataIndex, title, filterType } = column;
      return (
        <el-input
          v-model={this.search[`${dataIndex}Val`]}
          placeholder={`搜索${title}`}
          style={{ width: '180px' }}
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
        <div class="range-number">
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
            <li key={x.value} class="item">
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
            <li key={x.value} class="item">
              <el-radio label={x.value}>{x.text}</el-radio>
            </li>
          ))}
        </el-radio-group>
      );
    },
    ['date-rangeHandle'](column) {
      const { dataIndex } = column;
      return (
        <div onClick={e => e.stopPropagation()}>
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
        </div>
      );
    },
    doMove(el, val) {
      el && (el.style.transform = `translate3d(${-1 * val}px, 0, 0)`);
    },
    scrollEventHandle(e) {
      const l = e.target.scrollLeft;
      this.scrollLeft = l;
      this.throttle(this.doMove, 10)(this.$$tableHeader, l);
    },
    documentEventHandle(e) {
      this.closeAllPopover();
    },
    // 获取元素相对目标节点的左边距
    getOffsetLeft(el, target) {
      let sl = el.offsetLeft;
      let currentEl = el.offsetParent;
      while (currentEl !== null && currentEl !== target) {
        sl += currentEl.offsetLeft;
        currentEl = currentEl.offsetParent;
      }
      return sl;
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
    // 函数截流
    throttle(fn, delay) {
      return function(...args) {
        let nowTime = +new Date();
        if (!fn.lastTime || nowTime - fn.lastTime > delay) {
          fn.apply(this, args);
          fn.lastTime = nowTime;
        }
      };
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
    GET_FORMAT_ERROR() {
      return this.$pageTable.GET_REQUIRED_ERROR();
    },
    GET_SEARCH_HELPER_ERROR() {
      return this.$pageTable.GET_SEARCH_HELPER_ERROR();
    }
  },
  render() {
    const { $listeners, $slots, $attrs, $scopedSlots } = this;
    const props = getOptionProps(this);
    const wrapProps = mergeProps({
      ref: 'pageTable',
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
      <PageTable {...wrapProps}>
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

<style lang="less" scoped>
.popover-wrap {
  display: block;
  padding: 0;
  min-width: 120px;
  & > div {
    display: block;
    width: 100%;
    padding: 0;
  }
  li.item:not(:last-child) {
    margin-bottom: 7px;
  }
  /deep/ .range-number {
    display: block;
    .el-input {
      padding: 0;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
    }
  }
  /deep/ .el-input__inner {
    text-align: left !important;
  }
  /deep/ .el-checkbox {
    width: 100%;
  }
  /deep/ .el-radio {
    width: 100%;
    text-align: left;
  }
}
.popover-bottom {
  display: block;
  padding: 0;
  margin-top: 10px;
}
.topFilterSelected {
  color: @primaryColor;
}
</style>

<style lang="less">
.thead-popper {
  margin-top: 4px !important;
  border: 1px solid @borderColorSecondary;
  border-radius: @borderRadius;
  box-shadow: @boxShadow;
}
</style>
