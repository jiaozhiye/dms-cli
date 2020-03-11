/*
 * @Author: 焦质晔
 * @Date: 2020-02-28 23:01:43
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-11 18:26:24
 */
import { mapState, mapActions } from 'vuex';
import _ from 'lodash';

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
      thFilter: {},
      thSorter: {},
      ascend: this.sortDirections[0],
      descend: this.sortDirections[1]
    };
  },
  watch: {
    thFilter(val) {
      this.filterHandle();
      this.$$table.filters = this.formatFilterValue(val);
    },
    thSorter(val) {
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
            return <col key={dataIndex} style={{ width: `${width || renderWidth}px` }} />;
          })}
          {scrollY && <col style={{ width: `${gutterWidth}px` }} />}
        </colgroup>
      );
    },
    renderRows(columnRows) {
      const { scrollY } = this.$$table;
      return columnRows.map((columns, rowIndex) => (
        <tr key={rowIndex} class="v-header--row">
          {columns.map((column, cellIndex) => this.renderColumn(column))}
          {scrollY && <th class="gutter"></th>}
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
        scrollY
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
          [`v-cell-fix-left-last`]: fixed === 'left' && leftFixedColumns[leftFixedColumns.length - 1].dataIndex === dataIndex,
          [`v-cell-fix-right-first`]: fixed === 'right' && rightFixedColumns[0].dataIndex === dataIndex
        }
      ];
      const stys = {
        left: fixed === 'left' ? `${getStickyLeft(dataIndex)}px` : null,
        right: fixed === 'right' ? `${getStickyRight(dataIndex) + scrollY ? gutterWidth : 0}px` : null
      };
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
        `v-sort--asc-btn`,
        `v-icon--caret-top`,
        {
          [`sort--active`]: order === this.ascend
        }
      ];
      const descCls = [
        `v-sort--desc-btn`,
        `v-icon--caret-bottom`,
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
      return <THeadFilter column={column} />;
    },
    thClickHandle(ev, column) {
      const { sorter, dataIndex } = column;
      if (sorter) {
        const order = column.orderBy ? (column.orderBy === this.descend ? null : this.descend) : this.ascend;
        // 同步状态
        column.orderBy = order;
        this.thSorter = Object.assign({}, { [dataIndex]: order });
      }
    },
    // 表头排序
    sorterHandle() {
      if (0) {
        this.serverSorter();
      } else {
        this.clientSorter();
      }
    },
    // 服务端排序
    serverSorter() {},
    // 客户端排序
    clientSorter() {
      const { tableOriginData } = this.$$table;
      for (let key in this.thSorter) {
        const order = this.thSorter[key];
        const column = this.flattenColumns.find(column => column.dataIndex === key);
        if (!order) {
          this.$$table.tableFullData = !this.tableFilterData.length ? [...tableOriginData] : this.tableFilterData;
        } else {
          this.doSort(column, order);
        }
      }
    },
    doSort(column, order) {
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
      if (0) {
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
      for (let key in this.thFilter) {
        const [type, property] = key.split('|');
        const results = tableOriginData.filter(row => {
          const cellVal = getCellValue(row, property);
          const filterVal = this.thFilter[key];
          if (isEmpty(filterVal)) {
            return true;
          }
          if (type === 'text') {
            if (_.isNumber(cellVal)) {
              return Number(filterVal) === cellVal;
            }
            return cellVal.toLowerCase().includes(filterVal.toString().toLowerCase());
          }
          return true;
        });
        filterList.push(results);
      }
      if (!Object.keys(this.thFilter).length) {
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
