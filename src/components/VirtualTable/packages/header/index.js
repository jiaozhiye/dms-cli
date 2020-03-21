/*
 * @Author: 焦质晔
 * @Date: 2020-02-28 23:01:43
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-21 21:52:54
 */
import { mapState, mapActions } from 'vuex';
import _ from 'lodash';
import moment from 'moment';

import config from '../config';
import { convertToRows, getCellValue, isEmpty } from '../utils';

import Resizable from './resizable';
import AllSelection from '../selection/all';
import THeadFilter from '../filter';

export default {
  name: 'TableHeader',
  props: ['tableColumns', 'flattenColumns', 'sortDirections'],
  provide() {
    return {
      $$header: this
    };
  },
  inject: ['$$table'],
  data() {
    this.tableFilterData = [];
    return {
      filters: {},
      sorter: {},
      ascend: this.sortDirections[0],
      descend: this.sortDirections[1]
    };
  },
  computed: {
    isClientSorter() {
      return _.isUndefined(this.$$table.clientSorter) ? config.clientSorter : this.$$table.clientSorter;
    },
    isClientFilter() {
      return _.isUndefined(this.$$table.clientFilter) ? config.clientFilter : this.$$table.clientFilter;
    }
  },
  watch: {
    filters(val) {
      this.filterHandle();
      this.$$table.filters = this.formatFilterValue(val);
    },
    sorter(val) {
      this.sorterHandle();
      this.$$table.sorter = val;
    }
  },
  methods: {
    renderColgroup() {
      const {
        layout: { gutterWidth },
        scrollY
      } = this.$$table;
      return (
        <colgroup>
          {this.flattenColumns.map(column => {
            const { dataIndex, width, renderWidth } = column;
            return <col key={dataIndex} style={{ width: `${width || renderWidth}px`, minWidth: `${width || renderWidth}px` }} />;
          })}
          {scrollY && <col style={{ width: `${gutterWidth}px`, minWidth: `${gutterWidth}px` }} />}
        </colgroup>
      );
    },
    renderRows(columnRows) {
      const { scrollY, isIE, rightFixedColumns } = this.$$table;
      const cls = [
        `gutter`,
        {
          [`v-cell-fix-right`]: !!rightFixedColumns.length
        }
      ];
      const stys = !isIE
        ? {
            right: !!rightFixedColumns.length ? 0 : null
          }
        : null;
      return columnRows.map((columns, rowIndex) => (
        <tr key={rowIndex} class="v-header--row">
          {columns.map((column, cellIndex) => this.renderColumn(column))}
          {scrollY && <th class={cls} style={stys}></th>}
        </tr>
      ));
    },
    renderColumn(column) {
      const {
        leftFixedColumns,
        rightFixedColumns,
        getStickyLeft,
        getStickyRight,
        layout: { gutterWidth },
        resizable,
        scrollY,
        isIE
      } = this.$$table;
      const { dataIndex, colSpan, rowSpan, fixed, align, sorter, orderBy, filter } = column;
      const cls = [
        `v-header--column`,
        `col--ellipsis`,
        {
          [`col--center`]: align === 'center',
          [`col--right`]: align === 'right',
          [`v-column-has-sorter`]: sorter,
          [`v-column-has-filter`]: filter,
          [`v-column-sort`]: orderBy !== null,
          [`v-cell-fix-left`]: fixed === 'left',
          [`v-cell-fix-right`]: fixed === 'right',
          [`v-cell-fix-left-last`]: !isIE && fixed === 'left' && leftFixedColumns[leftFixedColumns.length - 1].dataIndex === dataIndex,
          [`v-cell-fix-right-first`]: !isIE && fixed === 'right' && rightFixedColumns[0].dataIndex === dataIndex
        }
      ];
      const stys = !isIE
        ? {
            left: fixed === 'left' ? `${getStickyLeft(dataIndex)}px` : null,
            right: fixed === 'right' ? `${getStickyRight(dataIndex) + (scrollY ? gutterWidth : 0)}px` : null
          }
        : null;
      const isResizable = resizable && dataIndex !== '__selection__';
      return (
        <th key={dataIndex} class={cls} style={{ ...stys }} colspan={colSpan} rowspan={rowSpan} onClick={ev => this.thClickHandle(ev, column)}>
          <div class="v-cell">{this.renderCell(column)}</div>
          {isResizable && <Resizable column={column} />}
        </th>
      );
    },
    renderCell(column) {
      const { dataIndex, type, sorter, orderBy, filter, title } = column;
      if (dataIndex === '__selection__' && type === 'checkbox') {
        return <AllSelection />;
      }
      let vNodes = [nCellTitle];
      if (sorter) {
        vNodes.push(this.renderSorter(orderBy));
      }
      if (filter) {
        vNodes.push(this.renderFilter(column));
      }
      const nCellTitle = (
        <span class="v-cell--title" title={title}>
          {title}
        </span>
      );
      vNodes.unshift(nCellTitle);
      return vNodes;
    },
    renderSorter(order) {
      const ascCls = [
        `iconfont`,
        `icon-caret-up`,
        `v-sort--asc-btn`,
        {
          [`sort--active`]: order === this.ascend
        }
      ];
      const descCls = [
        `iconfont`,
        `icon-caret-down`,
        `v-sort--desc-btn`,
        {
          [`sort--active`]: order === this.descend
        }
      ];
      return (
        <span class="v-cell--sort" title="排序">
          <i class={ascCls} />
          <i class={descCls} />
        </span>
      );
    },
    renderFilter(column) {
      return <THeadFilter column={column} filters={this.filters} />;
    },
    thClickHandle(ev, column) {
      const { sorter, dataIndex } = column;
      if (sorter) {
        const order = column.orderBy ? (column.orderBy === this.descend ? null : this.descend) : this.ascend;
        // 取消其他排序
        this.flattenColumns.forEach(x => {
          if (!x.sorter || x.dataIndex === dataIndex) return;
          x.orderBy = null;
        });
        // 同步状态
        column.orderBy = order;
        // 设置排序值
        this.sorter = Object.assign({}, { [dataIndex]: order });
      }
    },
    // 表头排序
    sorterHandle() {
      if (!this.isClientSorter) {
        this.serverSorter();
      } else {
        this.clientSorter();
      }
    },
    // 服务端排序
    serverSorter() {},
    // 客户端排序
    clientSorter() {
      for (let key in this.sorter) {
        const order = this.sorter[key];
        const column = this.flattenColumns.find(column => column.dataIndex === key);
        if (!order) {
          this.doResetHandle();
        } else {
          this.doSortHandle(column, order);
        }
      }
      if (!Object.keys(this.sorter).length) {
        this.doResetHandle();
      }
    },
    // 还原数据
    doResetHandle() {
      this.$$table.tableFullData = !this.tableFilterData.length ? [...this.$$table.tableOriginData] : this.tableFilterData;
    },
    // 排序算法
    doSortHandle(column, order) {
      const { dataIndex, sorter } = column;
      if (_.isFunction(sorter)) {
        this.$$table.tableFullData.sort(sorter);
      } else {
        this.$$table.tableFullData.sort((a, b) => {
          const start = getCellValue(a, dataIndex);
          const end = getCellValue(b, dataIndex);
          if (!!Number(start - end)) {
            return order === this.ascend ? start - end : end - start;
          }
          return order === this.ascend ? start.toString().localeCompare(end.toString()) : end.toString().localeCompare(start.toString());
        });
      }
    },
    // 表头筛选
    filterHandle() {
      if (!this.isClientFilter) {
        this.serverFilter();
      } else {
        this.clientFilter();
      }
    },
    // 服务端筛选
    serverFilter() {},
    // 客户端筛选
    clientFilter() {
      const { tableOriginData } = this.$$table;
      const filterList = [];

      for (let key in this.filters) {
        const [type, property] = key.split('|');
        const results = tableOriginData.filter(row => {
          const cellVal = getCellValue(row, property);
          const filterVal = this.filters[key];
          if (isEmpty(filterVal)) {
            return true;
          }
          if (type === 'text') {
            if (_.isNumber(cellVal)) {
              return Number(filterVal) === cellVal;
            }
            return cellVal.toLowerCase().includes(filterVal.toString().toLowerCase());
          }
          if (type === 'number') {
            return Number(filterVal) === cellVal;
          }
          if (type === 'range-number') {
            const [minVal = -Infinity, maxVal = Infinity] = filterVal;
            return cellVal >= Number(minVal) && cellVal <= Number(maxVal);
          }
          if (type === 'radio') {
            return cellVal === filterVal;
          }
          if (type === 'checkbox') {
            // 单元格的值是数组，说明是多选
            if (Array.isArray(cellVal)) {
              return filterVal.every(x => cellVal.includes(x));
            }
            return filterVal.includes(cellVal);
          }
          if (type === 'date') {
            return moment(cellVal, 'YYYY-MM-DD').diff(moment(filterVal), 'days') === 0;
          }
          if (type === 'range-date') {
            return moment(cellVal, 'YYYY-MM-DD').isBetween(filterVal[0], filterVal[1], null, '[]');
          }
          return true;
        });
        filterList.push(results);
      }

      if (!Object.keys(this.filters).length) {
        this.tableFilterData = [];
        this.$$table.tableFullData = [...tableOriginData];
      } else {
        // 求给定数组的交集
        const interList = _.intersection(...filterList);
        this.tableFilterData = [...interList];
        this.$$table.tableFullData = [...interList];
      }
    },
    // 格式化筛选参数
    formatFilterValue(option) {
      const result = {};
      for (let key in option) {
        if (!key.includes('|')) break;
        result[key.split('|')[1]] = option[key];
      }
      return result;
    },
    // 清空表头排序
    clearTheadSorter() {
      this.flattenColumns.forEach(x => {
        if (!x.sorter) return;
        x.orderBy = null;
      });
      this.sorter = {};
    },
    // 清空表头筛选
    clearTheadFilter() {
      this.filters = {};
    }
  },
  render() {
    const { tableColumns } = this;
    const {
      layout: { tableBodyWidth }
    } = this.$$table;
    const columnRows = convertToRows(tableColumns);
    // 是否拥有多级表头
    this.$$table.isGroup = columnRows.length > 1;
    return (
      <div class="v-table--header-wrapper">
        <table class="v-table--header" cellspacing="0" cellpadding="0" border="0" style={{ width: tableBodyWidth ? `${tableBodyWidth}px` : null }}>
          {this.renderColgroup()}
          <thead>{this.renderRows(columnRows)}</thead>
        </table>
      </div>
    );
  }
};
