/*
 * @Author: 焦质晔
 * @Date: 2020-02-28 22:28:35
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-04 22:40:17
 */
import { mapState, mapActions } from 'vuex';
import store from '../store';
import baseProps from './props';
import config from '../config';

import { columnsFlatMap, createFilterColumns, parseHeight, getScrollBarSize } from '../utils';

import layoutMethods from './layout-methods';
import coreMethods from './core-methods';

import TableHeader from '../header';
import TableBody from '../body';
import TableFooter from '../footer';

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
  mixins: [],
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
      return createFilterColumns(this.columns);
    },
    flattenColumns() {
      return columnsFlatMap(this.tableColumns);
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
    renderBorderLine() {
      return this.bordered && <div class="v-table--border-line" />;
    },
    renderResizableLine() {
      return this.resizable && <div ref="resizable-bar" class="v-table--resizable-bar" />;
    }
  },
  render() {
    const { size, bordered, isGroup, tableData, showHeader, showFooter, scrollX, scrollY, scrollYLoad, tableColumns, flattenColumns, dataSource, uidkey, tableStyles } = this;
    const vTableCls = [
      `v-table`,
      {
        [`size--${size}`]: !!size,
        [`t--border`]: bordered,
        [`is--empty`]: !tableData.length,
        [`is--group`]: isGroup,
        [`show--head`]: showHeader,
        [`show--foot`]: showFooter,
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
        flattenColumns,
        uidkey
      }
    };
    const tableFooterProps = {
      ref: 'tableFooter',
      props: {
        dataSource,
        flattenColumns,
        uidkey
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
