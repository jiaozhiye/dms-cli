/*
 * @Author: 焦质晔
 * @Date: 2020-02-28 22:28:35
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-02 02:40:07
 */
import { mapState, mapActions } from 'vuex';
import store from '../store';
import baseProps from './props';

import { columnsFlatMap, createFilterColumns, getScrollBarSize } from '../utils';

import layoutMethods from './layout-methods';
import coreMethods from './core-methods';

import TableHeader from '../header';
import TableBody from '../body';
import TableFooter from '../footer';

// 行高的映射表
const rowHeightMaps = {
  default: 48,
  medium: 44,
  small: 40,
  mini: 36
};

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
        rowHeight: rowHeightMaps[this.size || 'default']
      },
      // 是否拥有多级表头
      isGroup: false,
      // 表格列的默认最小宽度
      defaultColumnWidth: 100,
      // 表格布局相关参数
      layout: {
        // 滚动条宽度
        gutterWidth: getScrollBarSize(),
        // 表格内容宽度
        tableBodyWidth: 0,
        // 表格体可视区高度
        bodyWrapHeight: 0,
        // 头部高度
        headerHeight: 0,
        // 底部高度
        footerHeight: 0
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
    flatColumns() {
      return columnsFlatMap(this.columns);
    },
    showFooter() {
      return this.flatColumns.some(x => !!x.summation);
    },
    rowHeight() {
      return this.scrollYStore.rowHeight;
    }
  },
  created() {
    this.loadTableData();
  },
  mounted() {
    this.setTableHeight(this.height);
    this.setTableMaxHeight(this.maxHeight);
    this.updateColumnWidth();
  },
  methods: {
    ...layoutMethods,
    ...coreMethods,
    renderBorderLine() {
      return <div class="v-table--border-line" />;
    }
  },
  render() {
    const { size, border, isGroup, tableData, showHeader, showFooter, scrollX, scrollY, scrollYLoad, tableColumns, flatColumns, layout, uidkey } = this;
    const cls = [
      `v-table`,
      {
        [`size--${size}`]: !!size,
        [`t--border`]: border || isGroup,
        [`is--empty`]: !tableData.length,
        [`is--group`]: isGroup,
        [`show--head`]: showHeader,
        [`show--foot`]: showFooter,
        [`scroll--x`]: scrollX,
        [`scroll--y`]: scrollY,
        [`virtual--y`]: scrollYLoad
      }
    ];
    return (
      <div ref="v-table" class={cls}>
        {/* 主要内容 */}
        <div class="v-table--main-wrapper">
          <TableHeader ref="tableHeader" columns={tableColumns} flatColumns={flatColumns} layout={layout} />
          <TableBody ref="tableBody" tableData={tableData} flatColumns={flatColumns} layout={layout} uidkey={uidkey} />
          {showFooter && <TableFooter ref="tableFooter" dataSource={this.dataSource} flatColumns={flatColumns} layout={layout} uidkey={uidkey} />}
        </div>
        {/* 边框线 */}
        {this.renderBorderLine()}
      </div>
    );
  }
};
