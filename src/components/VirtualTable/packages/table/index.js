/*
 * @Author: 焦质晔
 * @Date: 2020-02-28 22:28:35
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-14 10:14:10
 */
import baseProps from './props';
import Store from '../store';
import config from '../config';
import { isEqual, isUndefined } from 'lodash';

import { columnsFlatMap, getAllColumns, getAllRowKeys, getScrollBarSize, createWhereSQL, parseHeight, debounce, browse } from '../utils';
import warning from '../../../_utils/warning';

import sizeMixin from '../../../_utils/mixins/size';
import columnsMixin from '../columns';
import expandableMixin from '../expandable/mixin';
import selectionMixin from '../selection/mixin';
import validateMixin from '../edit/validate';
import localStorageMixin from '../local-storage';
import layoutMethods from './layout-methods';
import coreMethods from './core-methods';
import interfaceMethods from './interface-methods';

import TableHeader from '../header';
import TableBody from '../body';
import TableFooter from '../footer';
import Pager from '../pager';
import SpinLoading from '../../../Spin';
import EmptyContent from '../empty';
import Alert from '../alert';
import ColumnFilter from '../column-filter';
import GroupSummary from '../group-summary';
import HighSearch from '../high-search';
import FullScreen from '../full-screen';
import Export from '../export';
import PrintTable from '../print';
import Reload from '../reload';

const noop = () => {};

export default {
  name: 'VirtualTable',
  props: {
    ...baseProps
  },
  provide() {
    return {
      $$table: this
    };
  },
  mixins: [sizeMixin, columnsMixin, expandableMixin, selectionMixin, validateMixin, localStorageMixin],
  data() {
    // 原始数据
    this.tableOriginData = [];
    // 内存分页，每页显示的数据
    this.pageTableData = [];
    // 高级检索的条件
    this.superSearchQuery = '';
    return {
      // 组件 store 仓库
      store: new Store(),
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
      // 自适应的表格高度
      autoHeight: 0,
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
        rowHeight: 0
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
      selectionKeys: [],
      // 已展开行的 keys
      rowExpandedKeys: [],
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
    $vTable() {
      return this.$refs[`v-table`];
    },
    $$tableBody() {
      return this.$refs[`tableBody`];
    },
    flattenColumns() {
      return columnsFlatMap(this.tableColumns);
    },
    allColumns() {
      return getAllColumns(this.tableColumns);
    },
    allRowKeys() {
      return getAllRowKeys(this.tableFullData, this.getRowKey);
    },
    tableChange() {
      return [this.pagination, this.filters, this.sorter, { currentDataSource: [...this.tableFullData], allDataSource: [...this.tableOriginData] }];
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
      return this.isFetch || this.webPagination;
    },
    isHeadSorter() {
      return this.flattenColumns.some(column => column.sorter);
    },
    isHeadFilter() {
      return this.flattenColumns.some(column => column.filter);
    },
    isGroupSummary() {
      return this.flattenColumns.some(column => !!column.groupSummary);
    },
    isTableEmpty() {
      return !this.tableData.length;
    },
    isFetch() {
      return !!this.fetch;
    },
    fetchParams() {
      const params = this.isFetch ? this.fetch.params : null;
      const query = createWhereSQL(this.filters) || this.superSearchQuery || '';
      const where = query ? { where: query } : null;
      return {
        ...this.sorter,
        ...where,
        ...params,
        ...this.pagination
      };
    },
    bordered() {
      return this.border || this.isGroup;
    },
    tableSize() {
      const size = this.size || config.toTableSize[this.currentSize];
      Object.assign(this.scrollYStore, { rowHeight: config.rowHeightMaps[size] });
      return size;
    },
    shouldUpdateHeight() {
      return this.height || this.maxHeight || this.isTableEmpty;
    },
    fullHeight() {
      const pagerHeight = this.showPagination ? 40 : 0;
      if (this.isFullScreen && this.shouldUpdateHeight) {
        return window.innerHeight - 30 - this.$refs[`v-top-info`].offsetHeight - pagerHeight;
      }
      return null;
    },
    tableStyles() {
      const { fullHeight, autoHeight } = this;
      const height = parseHeight(this.height);
      const maxHeight = parseHeight(this.maxHeight);
      if (fullHeight) {
        return { height: `${fullHeight}px` };
      }
      if (height) {
        return height !== 'auto' ? { height: `${height}px` } : { height: `${autoHeight}px` };
      }
      if (maxHeight) {
        return { maxHeight: `${maxHeight}px` };
      }
    }
  },
  watch: {
    dataSource(next) {
      this.createTableData(next);
    },
    tableFullData() {
      // 处理内存分页
      this.createLimitData();
      // 加载表格数据
      this.loadTableData().then(() => {
        this.doLayout();
      });
      // 触发 dataChange 事件
      debounce(this.dataChangeHandle)();
    },
    columns(next) {
      this.tableColumns = this.createTableColumns(next);
      this.setLocalColumns(next);
    },
    tableColumns() {
      this.doLayout();
    },
    filters() {
      this.$emit('change', ...this.tableChange);
    },
    sorter() {
      this.$emit('change', ...this.tableChange);
    },
    pagination: {
      handler() {
        this.$emit('change', ...this.tableChange);
      },
      deep: true
    },
    [`fetch.params`]() {
      this.clearSuperSearch();
    },
    fetchParams(next, prev) {
      if (!this.isFetch) return;
      const isOnlyPageChange = this.onlyPaginationChange(next, prev);
      if (!isOnlyPageChange && next.currentPage > 1) {
        this.toFirstPage();
      } else {
        debounce(this.getTableData)();
      }
    },
    expandable() {
      this.tableColumns = this.createTableColumns(this.columns);
    },
    rowSelection() {
      this.tableColumns = this.createTableColumns(this.columns);
    },
    selectionKeys(next, prev) {
      if (!this.rowSelection || isEqual(next, prev)) return;
      const { onChange = noop } = this.rowSelection;
      const selectedRows = this.tableFullData.filter(record => next.includes(this.getRowKey(record, record.index)));
      onChange(next, selectedRows);
    },
    [`rowSelection.selectedRowKeys`]() {
      this.selectionKeys = this.createSelectionKeys();
    },
    [`layout.viewportHeight`](next) {
      const visibleYSize = Math.ceil(next / this.scrollYStore.rowHeight);
      const renderSize = browse()['webkit'] ? visibleYSize + 3 : visibleYSize + 5;
      Object.assign(this.scrollYStore, { visibleSize: visibleYSize, offsetSize: visibleYSize, renderSize });
    },
    scrollYLoad(next) {
      !next ? this.updateScrollYSpace(!0) : this.loadScrollYData(this.$$tableBody.prevST);
    },
    scrollX(next) {
      this.isPingRight = next;
    },
    loading(next) {
      this.showLoading = next;
    }
  },
  created() {
    if (!this.isFetch) {
      this.createTableData(this.dataSource);
    } else {
      this.getTableData();
    }
    // 设置选择列
    this.selectionKeys = this.createSelectionKeys();
    // 设置展开行
    this.rowExpandedKeys = this.createRowExpandedKeys();
    // 加载表格数据
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
    this.destroy();
  },
  methods: {
    ...layoutMethods,
    ...coreMethods,
    ...interfaceMethods,
    getRowKey(row, index) {
      const { rowKey } = this;
      const key = typeof rowKey === 'function' ? rowKey(row, index) : row[rowKey];
      if (key === undefined) {
        warning(false, 'Table', 'Each record in table should have a unique `key` prop, or set `rowKey` to an unique primary key.');
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
      tableSize,
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
      isTableEmpty,
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
      alertPosition,
      topSpaceAlign,
      showFullScreen,
      showRefresh,
      tablePrint,
      exportExcel,
      isGroupSummary,
      showColumnDefine
    } = this;
    const vWrapperCls = { [`v-is--maximize`]: isFullScreen };
    const vTableCls = [
      `v-table`,
      {
        [`size--${tableSize}`]: !0,
        [`is--border`]: bordered,
        [`is--fixed`]: leftFixedColumns.length || rightFixedColumns.length,
        [`is--group`]: isGroup,
        [`is--sortable`]: isHeadSorter,
        [`is--filterable`]: isHeadFilter,
        [`is--empty`]: isTableEmpty,
        [`show--head`]: showHeader,
        [`show--foot`]: showFooter,
        [`ping--left`]: isPingLeft,
        [`ping--right`]: isPingRight,
        [`scroll--x`]: scrollX,
        [`scroll--y`]: scrollY,
        [`virtual--y`]: scrollYLoad
      }
    ];
    const spaceSlotCls = [
      `v-slot`,
      {
        [`fl`]: topSpaceAlign === 'left',
        [`fr`]: topSpaceAlign === 'right'
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
    const alertProps = {
      props: {
        total,
        selectionKeys
      }
    };
    const printProps = tablePrint
      ? {
          props: {
            tableColumns,
            flattenColumns,
            showHeader,
            showFooter,
            showLogo: isUndefined(tablePrint.showLogo) ? true : tablePrint.showLogo
          }
        }
      : null;
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
              : null
          }
        }
      : null;
    const pagerProps = {
      ref: 'pager',
      props: {
        size: tableSize,
        currentPage: pagination.currentPage,
        pageSize: pagination.pageSize,
        total,
        extraRender: () => (showAlert && alertPosition === 'bottom' ? <Alert {...alertProps} /> : null)
      },
      on: {
        change: this.pagerChangeHandle
      }
    };
    return (
      <div class={vWrapperCls}>
        <div ref="v-top-info" class="v-top-info">
          <div class="v-space clearfix">
            {/* 顶部信息 */}
            {showAlert && alertPosition === 'top' && <Alert class="fl" {...alertProps} />}
            <div class={spaceSlotCls}>
              {/* 默认槽口 */}
              {this.$slots[`default`]}
            </div>
          </div>
          <div class="v-actions">
            {/* 全屏 */}
            {showFullScreen && <FullScreen />}
            {/* 刷新 */}
            {showRefresh && !!fetch && <Reload />}
            {/* 打印 */}
            {tablePrint && <PrintTable {...printProps} />}
            {/* 导出 */}
            {exportExcel && <Export {...exportProps} />}
            {/* 高级检索 */}
            {isHeadFilter && <HighSearch columns={flattenColumns} />}
            {/* 分组汇总 */}
            {isGroupSummary && <GroupSummary columns={flattenColumns} />}
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
            {isTableEmpty && <EmptyContent />}
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
