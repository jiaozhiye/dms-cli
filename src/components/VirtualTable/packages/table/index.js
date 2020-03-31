/*
 * @Author: 焦质晔
 * @Date: 2020-02-28 22:28:35
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-31 10:46:40
 */
import { mapState, mapActions } from 'vuex';
import store from '../store';
import baseProps from './props';
import config from '../config';
import _ from 'lodash';

import { columnsFlatMap, getAllColumns, getScrollBarSize, parseHeight, debounce, browse } from '../utils';

import columnsMixin from '../columns';
import expandableMixin from '../expandable/mixin';
import selectionMixin from '../selection/mixin';
import localStorageMixin from '../local-storage';
import layoutMethods from './layout-methods';
import coreMethods from './core-methods';

import TableHeader from '../header';
import TableBody from '../body';
import TableFooter from '../footer';
import Pager from '../pager';
import SpinLoading from '../spin';
import EmptyContent from '../empty';
import Alert from '../alert';
import ColumnFilter from '../column-filter';
import FullScreen from '../full-screen';
import Export from '../export';
import PrintTable from '../print';
import Reload from '../reload';

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
  mixins: [columnsMixin, expandableMixin, selectionMixin, localStorageMixin],
  data() {
    // 原始数据
    this.tableOriginData = [];
    return {
      // 渲染中的数据
      tableData: [],
      // 完整数据 - 重要
      tableFullData: [],
      // 表格列
      tableColumns: this.createTableColumns(this.columns),
      // 表头筛选
      filters: {},
      // 表头排序
      sorter: {},
      // 分页
      pagination: {
        currentPage: config.pagination.currentPage,
        pageSize: config.pagination.pageSize
      },
      // 记录总数
      total: 0,
      // 页面是否加载中
      showLoading: this.loading,
      // 是否存在横向滚动条
      scrollX: false,
      // 是否存在纵向滚动条
      scrollY: false,
      // 是否启用了纵向 Y 可视渲染方式加载
      scrollYLoad: false,
      // 是否拥有多级表头
      isGroup: false,
      // 存放纵向 Y 虚拟滚动相关信息
      scrollYStore: {
        startIndex: 0,
        visibleIndex: 0,
        renderSize: 0,
        offsetSize: 0,
        visibleSize: 0,
        rowHeight: config.rowHeightMaps[this.size || 'default']
      },
      // 支持的排序方式
      sortDirections: ['ascend', 'descend'],
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
      // 选择列，已选中行的 keys
      selectionKeys: this.createSelectionKeys(),
      // 已展开行的 keys
      rowExpandedKeys: this.createRowExpandedKeys(),
      // X 滚动条是否离开左边界
      isPingLeft: false,
      // X 滚动条是否离开右边界
      isPingRight: false,
      // 响应式变化的状态
      resizeState: {
        width: 0,
        height: 0
      },
      // 是否是 IE11
      isIE: browse()['msie'],
      // 全屏样式
      isFullScreen: false,
      // 服务端合计
      summaries: {}
    };
  },
  computed: {
    $vTopInfo() {
      return this.$refs[`v-top-info`];
    },
    $vTable() {
      return this.$refs[`v-table`];
    },
    $$tableHeader() {
      return this.$refs[`tableHeader`];
    },
    $$tableBody() {
      return this.$refs[`tableBody`];
    },
    $$tableFooter() {
      return this.$refs[`tableFooter`];
    },
    flattenColumns() {
      return columnsFlatMap(this.tableColumns);
    },
    allColumns() {
      return getAllColumns(this.tableColumns);
    },
    tableChange() {
      return [this.pagination, this.filters, this.sorter, { currentDataSource: this.tableFullData }];
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
    showPagination() {
      return !!this.fetch;
    },
    isHeadSorter() {
      return this.flattenColumns.some(column => column.sorter);
    },
    isHeadFilter() {
      return this.flattenColumns.some(column => column.filter);
    },
    bordered() {
      return this.border || this.isGroup;
    },
    fetchParams() {
      const params = this.fetch ? this.fetch.params : null;
      return {
        ...this.sorter,
        ...this.filters,
        ...params,
        ...this.pagination
      };
    },
    shouldUpdateHeight() {
      return this.height || this.maxHeight;
    },
    calcHeight() {
      const pagerHeight = this.showPagination ? 40 : 0;
      if (this.isFullScreen && this.shouldUpdateHeight) {
        return window.innerHeight - 30 - this.$vTopInfo.offsetHeight - pagerHeight;
      }
      return null;
    },
    tableStyles() {
      const { calcHeight } = this;
      const height = parseHeight(this.height);
      const maxHeight = parseHeight(this.maxHeight);
      if (calcHeight) {
        return { height: `${calcHeight}px` };
      }
      if (height) {
        return { height: `${height}px` };
      }
      if (maxHeight) {
        return { maxHeight: `${maxHeight}px` };
      }
    }
  },
  watch: {
    dataSource(val) {
      this.createTableData(val);
    },
    tableFullData(next, prev) {
      this.__dataLengthState__ = next.length !== prev.length;
      this.loadTableData().then(() => {
        this.doLayout();
        this.__dataLengthState__ = !1;
      });
      // 触发 dataChange 事件
      debounce(this.dataChangeHandle)();
    },
    columns(val) {
      this.tableColumns = this.createTableColumns(val);
      this.setLocalColumns(val);
      this.doLayout();
    },
    filters() {
      this.$emit('change', ...this.tableChange);
    },
    sorter() {
      this.$emit('change', ...this.tableChange);
    },
    pagination() {
      this.$emit('change', ...this.tableChange);
    },
    loading(val) {
      this.showLoading = val;
    },
    fetchParams(next, prev) {
      if (!this.fetch) return;
      if (!this.onlyPaginationChange(next, prev)) {
        this.toFirstPage();
      } else {
        this.getTableData();
      }
    },
    [`rowSelection.selectedRowKeys`]() {
      this.selectionKeys = this.createSelectionKeys();
    },
    selectionKeys(val) {
      if (!this.rowSelection) return;
      const { onChange = noop } = this.rowSelection;
      onChange(val);
    },
    scrollX(val) {
      this.isPingRight = val;
    }
  },
  created() {
    if (!this.fetch) {
      this.createTableData(this.dataSource);
    } else {
      this.getTableData();
    }
    this.loadTableData().then(() => {
      this.doLayout();
    });
  },
  mounted() {
    this.doLayout();
    this.bindEvents();
    this.createResizeState();
  },
  destroyed() {
    this.removeEvents();
  },
  methods: {
    ...layoutMethods,
    ...coreMethods,
    getRowKey(row, index) {
      const { rowKey } = this;
      const key = typeof rowKey === 'function' ? rowKey(row, index) : row[rowKey];
      if (key === undefined) {
        console.error('[Table]: Each record in table should have a unique `key` prop, or set `rowKey` to an unique primary key.');
        return index;
      }
      return key;
    }
  },
  render() {
    const {
      isFullScreen,
      tableData,
      tableFullData,
      columns,
      tableColumns,
      flattenColumns,
      size,
      showLoading,
      bordered,
      tableStyles,
      rowStyle,
      cellStyle,
      showHeader,
      showFooter,
      showPagination,
      isGroup,
      isHeadSorter,
      isHeadFilter,
      sortDirections,
      scrollX,
      scrollY,
      scrollYLoad,
      isPingLeft,
      isPingRight,
      leftFixedColumns,
      rightFixedColumns,
      fetch,
      fetchParams,
      pagination,
      total,
      selectionKeys,
      showAlert,
      showFullScreen,
      showRefresh,
      exportExcel,
      showColumnDefine
    } = this;
    const vWrapperCls = { [`v-is--maximize`]: isFullScreen };
    const vTopInfoCls = [`v-top-info`];
    const vTableCls = [
      `v-table`,
      {
        [`size--${size}`]: !!size,
        [`is--border`]: bordered,
        [`is--fixed`]: leftFixedColumns.length || rightFixedColumns.length,
        [`is--group`]: isGroup,
        [`is--sortable`]: isHeadSorter,
        [`is--filterable`]: isHeadFilter,
        [`is--empty`]: !tableData.length,
        [`show--head`]: showHeader,
        [`show--foot`]: showFooter,
        [`ping--left`]: isPingLeft,
        [`ping--right`]: isPingRight,
        [`scroll--x`]: scrollX,
        [`scroll--y`]: scrollY,
        [`virtual--y`]: scrollYLoad
      }
    ];
    const tableHeaderProps = {
      ref: 'tableHeader',
      props: {
        tableColumns,
        flattenColumns,
        sortDirections
      }
    };
    const tableBodyProps = {
      ref: 'tableBody',
      props: {
        tableData,
        flattenColumns,
        rowStyle,
        cellStyle
      }
    };
    const tableFooterProps = {
      ref: 'tableFooter',
      props: {
        flattenColumns
      }
    };
    const pagerProps = {
      ref: 'pager',
      props: {
        currentPage: pagination.currentPage,
        pageSize: pagination.pageSize,
        total
      },
      on: {
        change: this.pagerChangeHandle
      }
    };
    const alertProps = {
      props: {
        total,
        selectionKeys
      }
    };
    const printProps = {
      props: {
        tableColumns,
        flattenColumns,
        showHeader,
        showFooter
      }
    };
    const exportProps = exportExcel
      ? {
          props: {
            flattenColumns,
            data: tableFullData,
            fileName: exportExcel.fileName,
            fetch: !!fetch
              ? {
                  api: fetch.api,
                  params: fetchParams,
                  dataKey: fetch.dataKey,
                  total
                }
              : null,
            calcExportHandle: exportExcel.calcExportHandle
          }
        }
      : null;
    return (
      <div class={vWrapperCls}>
        {/* 表格信息 */}
        <div ref="v-top-info" class={vTopInfoCls}>
          <div>
            {/* 通知 */}
            {showAlert && <Alert {...alertProps} />}
          </div>
          <div>
            {/* 默认槽口 */}
            {this.$slots[`default`]}
            {/* 全屏 */}
            {showFullScreen && <FullScreen />}
            {/* 刷新 */}
            {showRefresh && !!fetch && <Reload />}
            {/* 打印 */}
            <PrintTable {...printProps} />
            {/* 导出 */}
            {exportExcel && <Export {...exportProps} />}
            {/* 列定义 */}
            {showColumnDefine && <ColumnFilter columns={columns} />}
          </div>
        </div>
        <SpinLoading spinning={showLoading} tip="Loading...">
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
            {/* 空数据 */}
            {!tableData.length && <EmptyContent />}
            {/* 列宽线 */}
            {this.renderResizableLine()}
          </div>
        </SpinLoading>
        {/* 分页 */}
        {showPagination && <Pager {...pagerProps} />}
      </div>
    );
  }
};
