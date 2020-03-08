/*
 * @Author: 焦质晔
 * @Date: 2020-02-28 23:01:43
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-08 14:01:39
 */
import { mapState, mapActions } from 'vuex';
import _ from 'lodash';

import { getCellValue } from '../utils';

import Resizable from './resizable';
import AllSelection from '../selection/all';

const getAllColumns = columns => {
  const result = [];
  columns.forEach(column => {
    if (column.children) {
      result.push(column);
      result.push.apply(result, getAllColumns(column.children));
    } else {
      result.push(column);
    }
  });
  return result;
};

const convertToRows = originColumns => {
  let maxLevel = 1;
  const traverse = (column, parent) => {
    if (parent) {
      column.level = parent.level + 1;
      if (maxLevel < column.level) {
        maxLevel = column.level;
      }
    }
    if (column.children) {
      let colSpan = 0;
      column.children.forEach(subColumn => {
        traverse(subColumn, column);
        colSpan += subColumn.colSpan;
      });
      column.colSpan = colSpan;
    } else {
      column.colSpan = 1;
    }
  };

  originColumns.forEach(column => {
    column.level = 1;
    traverse(column);
  });

  const rows = [];
  for (let i = 0; i < maxLevel; i++) {
    rows.push([]);
  }

  const allColumns = getAllColumns(originColumns);

  allColumns.forEach(column => {
    if (!column.children) {
      column.rowSpan = maxLevel - column.level + 1;
    } else {
      column.rowSpan = 1;
    }
    rows[column.level - 1].push(column);
  });

  return rows;
};

export default {
  name: 'TableHeader',
  props: ['tableColumns', 'flattenColumns', 'sortDirections'],
  inject: ['$$table'],
  data() {
    return {
      ascend: this.sortDirections[0],
      descend: this.sortDirections[1]
    };
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
        vNodes.push(this.renderFilter());
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
    renderFilter() {
      const cls = [`v-filter--btn`, `v-icon--funnel`];
      return (
        <span class="v-cell--filter" title="筛选">
          <i class={cls} />
        </span>
      );
    },
    thClickHandle(ev, column) {
      ev.stopPropagation();
      const { sorter, filter } = column;
      if (sorter) {
        const order = column.orderBy ? (column.orderBy === this.descend ? null : this.descend) : this.ascend;
        if (!order) {
          // 还原数据
        } else {
          this.doSortHandler(column, order);
        }
        // 同步状态
        column.orderBy = order;
      }
    },
    doSortHandler(column, order) {
      const { dataIndex, sorter } = column;
      const dataSource = [...this.$$table.dataSource];
      let result = [];
      if (_.isFunction(sorter)) {
        result = dataSource.sort(sorter);
      } else {
        result = dataSource.sort((a, b) => {
          const start = getCellValue(a, dataIndex);
          const end = getCellValue(b, dataIndex);
          if (!!Number(start - end)) {
            return order === this.ascend ? start - end : end - start;
          }
          return order === this.ascend ? start.toString().localeCompare(end.toString()) : end.toString().localeCompare(start.toString());
        });
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
