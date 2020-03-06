/*
 * @Author: 焦质晔
 * @Date: 2020-02-28 22:28:35
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-06 22:17:56
 */
import { mapState, mapActions } from 'vuex';
import store from '../store';
import baseProps from './props';
import config from '../config';
import _ from 'lodash';

import { columnsFlatMap, createFilterColumns, parseHeight, getScrollBarSize } from '../utils';

import columnsMixin from '../columns';
import layoutMethods from './layout-methods';
import coreMethods from './core-methods';

import TableHeader from '../header';
import TableBody from '../body';
import TableFooter from '../footer';

const noop = () => {};

export default {
  name: 'Table',
  store,
  props: {
    ...baseProps
  },
  provide() {
    return {
      $$table: this
    };
  },
  mixins: [columnsMixin],
  data() {
    return {
      // 渲染中的数据
      tableData: [],
      // 是否存在横向滚动条
      scrollX: false,
      // 是否存在纵向滚动条
      scrollY: false,
      // 是否启用了纵向 Y 可视渲染方式加载
      scrollYLoad: false,
      // 存放纵向 Y 虚拟滚动相关信息
      scrollYStore: {
        startIndex: 0,
        visibleIndex: 0,
        renderSize: 0,
        offsetSize: 0,
        visibleSize: 0,
        rowHeight: config.rowHeightMaps[this.size || 'default']
      },
      // 是否拥有多级表头
      isGroup: false,
      // 表格列的默认最小宽度
      defaultColumnWidth: 100,
      // 表格布局相关参数
      layout: {
        // 滚动条宽度
        gutterWidth: getScrollBarSize(),
        // 表格宽度
        tableWidth: 0,
        // 表格体宽度
        tableBodyWidth: 0,
        // 表格体内容高度
        tableBodyHeight: 0,
        // 表格体父容器（视口）高度
        viewportHeight: 0,
        // 头部高度
        headerHeight: 0,
        // 底部高度
        footerHeight: 0
      },
      // 选择列的选中数据
      selectionKeys: this.initialSelectionKeys('selectedRowKeys'),
      // 选择列的禁选数据
      disabledSelectionKeys: this.initialSelectionKeys('disabledRowKeys'),
      // X 滚动条是否离开左边界
      isPingLeft: false,
      // X 滚动条是否离开右边界
      isPingRight: false,
      // 响应式变化的状态
      resizeState: {
        width: 0
      }
    };
  },
  computed: {
    $vTable() {
      return this.$refs[`v-table`] || null;
    },
    tableColumns() {
      const column = this.createSelectionColumn(this.rowSelection);
      return createFilterColumns(column ? [column, ...this.columns] : this.columns);
    },
    flattenColumns() {
      return columnsFlatMap(this.tableColumns);
    },
    leftFixedColumns() {
      return this.flattenColumns.filter(column => column.fixed === 'left');
    },
    rightFixedColumns() {
      return this.flattenColumns.filter(column => column.fixed === 'right');
    },
    showFooter() {
      return this.flattenColumns.some(x => !!x.summation);
    },
    bordered() {
      return this.border || this.isGroup;
    },
    shouldUpdateHeight() {
      return this.height || this.maxHeight;
    },
    tableStyles() {
      const style = {};
      const height = parseHeight(this.height);
      const maxHeight = parseHeight(this.maxHeight);
      if (height) {
        style.height = `${height}px`;
      }
      if (maxHeight) {
        style.maxHeight = `${maxHeight}px`;
      }
      return style;
    }
  },
  watch: {
    flattenColumns() {
      this.doLayout();
    },
    selectionKeys(val) {
      if (!this.rowSelection) return;
      const { onChange = noop } = this.rowSelection;
      onChange(val);
    },
    scrollX(val) {
      val && (this.isPingRight = val);
    },
    height() {
      this.updateElsHeight();
    },
    maxHeight() {
      this.updateElsHeight();
    }
  },
  created() {
    this.loadTableData().then(() => {
      this.doLayout();
    });
  },
  mounted() {
    this.doLayout();
    this.bindEvents();
    this.resizeState = Object.assign({}, { width: this.$vTable.offsetWidth });
  },
  destroyed() {
    this.unbindEvents();
  },
  methods: {
    ...layoutMethods,
    ...coreMethods,
    getRowKey(row, index) {
      const { rowKey } = this;
      const key = typeof rowKey === 'function' ? rowKey(row, index) : row[rowKey];
      if (key === undefined) {
        console.warn('[Table]:Each record in table should have a unique `key` prop, or set `rowKey` to an unique primary key.');
        return index;
      }
      return key;
    },
    createSelectionColumn(options) {
      if (!options) {
        return null;
      }
      const { type } = options;
      return {
        dataIndex: '__selection__',
        title: type === 'radio' ? '#' : '',
        width: 50,
        fixed: 'left',
        type
      };
    },
    initialSelectionKeys(type) {
      const { rowSelection } = this;
      if (!rowSelection) {
        return [];
      }
      return rowSelection[type] || [];
    },
    renderBorderLine() {
      return this.bordered && <div class="v-table--border-line" />;
    },
    renderResizableLine() {
      return this.resizable && <div ref="resizable-bar" class="v-table--resizable-bar" />;
    }
  },
  render() {
    const {
      size,
      bordered,
      isGroup,
      tableData,
      showHeader,
      showFooter,
      scrollX,
      scrollY,
      scrollYLoad,
      tableColumns,
      flattenColumns,
      dataSource,
      tableStyles,
      leftFixedColumns,
      rightFixedColumns,
      isPingLeft,
      isPingRight
    } = this;
    const vTableCls = [
      `v-table`,
      {
        [`size--${size}`]: !!size,
        [`is--border`]: bordered,
        [`is--fixed`]: leftFixedColumns.length || rightFixedColumns.length,
        [`is--group`]: isGroup,
        [`is--empty`]: !tableData.length,
        [`show--head`]: showHeader,
        [`show--foot`]: showFooter,
        [`v-table-ping-left`]: isPingLeft,
        [`v-table-ping-right`]: isPingRight,
        [`scroll--x`]: scrollX,
        [`scroll--y`]: scrollY,
        [`virtual--y`]: scrollYLoad
      }
    ];
    const tableHeaderProps = {
      ref: 'tableHeader',
      props: {
        tableColumns,
        flattenColumns
      }
    };
    const tableBodyProps = {
      ref: 'tableBody',
      props: {
        tableData,
        flattenColumns
      }
    };
    const tableFooterProps = {
      ref: 'tableFooter',
      props: {
        dataSource,
        flattenColumns
      }
    };
    return (
      <div ref="v-table" class={vTableCls} style={tableStyles}>
        {/* 主要内容 */}
        <div class="v-table--main-wrapper">
          {/* 头部 */}
          <TableHeader {...tableHeaderProps} />
          {/* 表格体 */}
          <TableBody {...tableBodyProps} />
          {/* 底部 */}
          {showFooter && <TableFooter {...tableFooterProps} />}
        </div>
        {/* 边框线 */}
        {this.renderBorderLine()}
        {/* 列宽线 */}
        {this.renderResizableLine()}
      </div>
    );
  }
};
