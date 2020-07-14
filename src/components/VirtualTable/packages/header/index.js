/*
 * @Author: 焦质晔
 * @Date: 2020-02-28 23:01:43
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-14 10:14:52
 */
import { pickBy, intersection, isFunction } from 'lodash';
import config from '../config';
import Locale from '../locale/mixin';
import { where } from '../filter-sql';
import { convertToRows, getCellValue, createWhereSQL, isEmpty } from '../utils';

import Resizable from './resizable';
import AllSelection from '../selection/all';
import SvgIcon from '../../../SvgIcon';
import THeadFilter from '../filter';

export default {
  name: 'TableHeader',
  mixins: [Locale],
  props: ['tableColumns', 'flattenColumns', 'sortDirections'],
  provide() {
    return {
      $$header: this
    };
  },
  inject: ['$$table'],
  data() {
    return {
      filters: {},
      sorter: {},
      ascend: this.sortDirections[0],
      descend: this.sortDirections[1]
    };
  },
  computed: {
    isClientSorter() {
      return !this.$$table.isFetch;
    },
    isClientFilter() {
      return !this.$$table.isFetch;
    }
  },
  watch: {
    filters(val) {
      this.filterHandle();
      // if (this.isClientFilter) return;
      this.$$table.filters = this.formatFilterValue(val);
    },
    sorter(val) {
      this.sorterHandle();
      // if (this.isClientSorter) return;
      this.$$table.sorter = this.formatSorterValue(val);
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
          {columns.map((column, cellIndex) => this.renderColumn(column, columns, rowIndex, cellIndex))}
          {scrollY && <th class={cls} style={stys}></th>}
        </tr>
      ));
    },
    renderColumn(column, columns, rowIndex, cellIndex) {
      const {
        getStickyLeft,
        getStickyRight,
        layout: { gutterWidth },
        resizable,
        scrollY,
        isIE
      } = this.$$table;
      const { dataIndex, colSpan, rowSpan, fixed, align, sorter, orderBy, filter, required } = column;
      const leftFixedColumns = columns.filter(x => x.fixed === 'left');
      const rightFixedColumns = columns.filter(x => x.fixed === 'right');
      const cls = [
        `v-header--column`,
        `col--ellipsis`,
        {
          [`col--center`]: align === 'center',
          [`col--right`]: align === 'right',
          [`v-column--required`]: !!required,
          [`v-column-has-sorter`]: sorter,
          [`v-column-has-filter`]: filter,
          [`v-column--sort`]: !!orderBy,
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
      const isResizable = resizable && !['__expandable__', '__selection__'].includes(dataIndex);
      return (
        <th key={dataIndex} class={cls} style={{ ...stys }} colspan={colSpan} rowspan={rowSpan} onClick={ev => this.thClickHandle(ev, column)}>
          <div class="v-cell--wrapper">{this.renderCell(column)}</div>
          {isResizable && <Resizable column={column} />}
        </th>
      );
    },
    renderCell(column) {
      const { dataIndex, type, sorter, orderBy, filter, title } = column;
      const { selectionKeys } = this.$$table;
      if (dataIndex === '__selection__' && type === 'checkbox') {
        return (
          <div class="v-cell">
            <AllSelection selectionKeys={selectionKeys} />
          </div>
        );
      }
      let vNodes = [];
      if (sorter) {
        vNodes.push(this.renderSorter(orderBy));
      }
      if (filter) {
        vNodes.push(this.renderFilter(column));
      }
      vNodes.unshift(
        <div class="v-cell" title={title}>
          {title}
        </div>
      );
      return vNodes;
    },
    renderSorter(order) {
      const ascCls = [
        `v-sort--asc-btn`,
        {
          [`sort--active`]: order === this.ascend
        }
      ];
      const descCls = [
        `v-sort--desc-btn`,
        {
          [`sort--active`]: order === this.descend
        }
      ];
      return (
        <span class="v-cell--sort">
          <SvgIcon class={ascCls} icon-class="caret-up" title={this.t('table.sorter.asc')} />
          <SvgIcon class={descCls} icon-class="caret-down" title={this.t('table.sorter.desc')} />
        </span>
      );
    },
    renderFilter(column) {
      return <THeadFilter column={column} filters={this.filters} />;
    },
    thClickHandle(ev, column) {
      const { multipleSort } = this.$$table;
      const { sorter, orderBy, dataIndex } = column;
      if (sorter) {
        const order = orderBy ? (orderBy === this.descend ? null : this.descend) : this.ascend;
        // 取消其他排序
        if (!multipleSort) {
          this.flattenColumns.forEach(x => {
            if (!x.sorter || x.dataIndex === dataIndex) return;
            x.orderBy = null;
          });
        }
        // 同步状态
        column.orderBy = order;
        // 设置排序值
        if (!multipleSort) {
          this.sorter = Object.assign({}, { [dataIndex]: order });
        } else {
          // 后点击的排序列，key 排在最后
          delete this.sorter[dataIndex];
          this.sorter = Object.assign({}, this.sorter, { [dataIndex]: order });
        }
      }
    },
    // 表头排序
    sorterHandle() {
      if (!this.isClientSorter) return;
      this.clientSorter();
    },
    // 客户端排序
    clientSorter() {
      const validSorter = pickBy(this.sorter);
      for (let key in validSorter) {
        let column = this.flattenColumns.find(column => column.dataIndex === key);
        this.doSortHandle(column, validSorter[key]);
      }
      if (!Object.keys(validSorter).length) {
        this.doResetHandle();
      }
    },
    // 还原排序数据
    doResetHandle() {
      const { tableFullData, tableOriginData } = this.$$table;
      this.$$table.tableFullData = intersection(tableOriginData, tableFullData);
    },
    // 排序算法
    doSortHandle(column, order) {
      const { dataIndex, sorter } = column;
      if (isFunction(sorter)) {
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
    filterHandle(sql) {
      if (!this.isClientFilter) return;
      this.clientFilter(sql);
    },
    // 客户端筛选
    clientFilter(sql) {
      if (typeof sql === 'undefined') {
        sql = createWhereSQL(this.filters);
      }
      this.$$table.tableFullData = sql !== '' ? where(this.$$table.tableOriginData, sql) : [...this.$$table.tableOriginData];
      // 执行排序
      this.sorterHandle();
    },
    // 格式化排序参数
    formatSorterValue(option) {
      const result = [];
      Object.keys(option).forEach(dataIndex => {
        if (option[dataIndex] !== null) {
          result.push(`${dataIndex}|${option[dataIndex]}`);
        }
      });
      return result.length ? { [config.sorterFieldName]: result.join(',') } : {};
    },
    // 格式化筛选参数
    formatFilterValue(option) {
      const result = {};
      for (let key in option) {
        if (!key.includes('|')) continue;
        let [type, property] = key.split('|');
        for (let mark in option[key]) {
          if (isEmpty(option[key][mark])) {
            delete option[key][mark];
          }
        }
        // result[`${type}|${property}`]
        result[property] = option[key];
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
