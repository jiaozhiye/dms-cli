/*
 * @Author: 焦质晔
 * @Date: 2020-02-28 23:01:43
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-21 19:16:51
 */
import { mapState, mapActions } from 'vuex';
import addEventListener from 'add-dom-event-listener';
import { parseHeight, getCellValue } from '../utils';
import _ from 'lodash';

import Selection from '../selection';

export default {
  name: 'TableBody',
  props: ['flattenColumns', 'tableData', 'rowStyle', 'cellStyle'],
  inject: ['$$table'],
  data() {
    this.prevST = 0;
    this.prevSL = 0;
    return {};
  },
  computed: {
    bodyWidth() {
      const { layout, scrollY } = this.$$table;
      const { tableBodyWidth, gutterWidth } = layout;
      return tableBodyWidth ? `${tableBodyWidth - (scrollY ? gutterWidth : 0)}px` : null;
    },
    wrapStyle() {
      const { layout, height, maxHeight } = this.$$table;
      const { headerHeight, viewportHeight, footerHeight } = layout;
      if (height) {
        return {
          height: `${viewportHeight}px`
        };
      }
      if (maxHeight) {
        const maxTableHeight = parseHeight(maxHeight);
        if (typeof maxTableHeight === 'number') {
          return {
            maxHeight: `${maxTableHeight - headerHeight - footerHeight}px`
          };
        }
      }
      return null;
    }
  },
  mounted() {
    this.event = addEventListener(this.$el, 'scroll', this.scrollEvent);
  },
  destroyed() {
    this.event.remove();
  },
  methods: {
    scrollEvent(ev) {
      const { scrollYLoad, $refs, layout } = this.$$table;
      const { tableHeader, tableFooter } = $refs;
      const { scrollTop: st, scrollLeft: sl } = ev.target;
      if (sl !== this.prevSL) {
        if (tableHeader) {
          tableHeader.$el.scrollLeft = sl;
        }
        if (tableFooter) {
          tableFooter.$el.scrollLeft = sl;
        }
        this.$$table.isPingLeft = sl > 0;
        this.$$table.isPingRight = sl + layout.tableWidth < layout.tableBodyWidth;
      }
      if (scrollYLoad && st !== this.prevST) {
        this.$$table.triggerScrollYEvent(ev);
      }
      this.prevST = st;
      this.prevSL = sl;
    },
    renderBodyYSpace() {
      return <div class="v-body--y-space" />;
    },
    renderColgroup() {
      return (
        <colgroup>
          {this.flattenColumns.map(column => {
            const { dataIndex, width, renderWidth } = column;
            return <col key={dataIndex} style={{ width: `${width || renderWidth}px`, minWidth: `${width || renderWidth}px` }} />;
          })}
        </colgroup>
      );
    },
    renderRows() {
      const { selectionKeys } = this.$$table;
      const rows = this.tableData.map((row, rowIndex) => {
        const key = this.$$table.getRowKey(row, rowIndex);
        const extraStys = this.rowStyle ? (_.isFunction(this.rowStyle) ? this.rowStyle(row, rowIndex) : this.rowStyle) : null;
        const cls = [
          `v-body--row`,
          {
            [`v-body--row-selected`]: selectionKeys.includes(key)
          }
        ];
        return (
          <tr key={key} data-row-key={key} class={cls} style={extraStys}>
            {this.flattenColumns.map((column, cellIndex) => this.renderColumn(column, cellIndex, row, rowIndex, key))}
          </tr>
        );
      });
      return rows;
    },
    renderColumn(column, cellIndex, row, rowIndex, rowKey) {
      const { sorter, leftFixedColumns, rightFixedColumns, getStickyLeft, getStickyRight, ellipsis, isIE } = this.$$table;
      const { dataIndex, fixed, align, className } = column;
      const { rowspan, colspan } = this.getSpan(row, column, rowIndex, cellIndex);
      const isEllipsis = ellipsis || column.ellipsis;
      if (!rowspan || !colspan) {
        return null;
      }
      const cls = [
        `v-body--column`,
        {
          [`col--ellipsis`]: isEllipsis,
          [`col--center`]: align === 'center',
          [`col--right`]: align === 'right',
          [`v-column--sort`]: !!sorter[dataIndex],
          [`v-cell-fix-left`]: fixed === 'left',
          [`v-cell-fix-right`]: fixed === 'right',
          [`v-cell-fix-left-last`]: !isIE && fixed === 'left' && leftFixedColumns[leftFixedColumns.length - 1].dataIndex === dataIndex,
          [`v-cell-fix-right-first`]: !isIE && fixed === 'right' && rightFixedColumns[0].dataIndex === dataIndex,
          [className]: !!className
        }
      ];
      const stys = !isIE
        ? {
            left: fixed === 'left' ? `${getStickyLeft(dataIndex)}px` : null,
            right: fixed === 'right' ? `${getStickyRight(dataIndex)}px` : null
          }
        : null;
      const extraStys = this.cellStyle ? (_.isFunction(this.cellStyle) ? this.cellStyle(row, column, rowIndex, cellIndex) : this.cellStyle) : null;
      return (
        <td
          key={dataIndex}
          title={isEllipsis && getCellValue(row, dataIndex)}
          rowspan={rowspan}
          colspan={colspan}
          class={cls}
          style={{ ...stys, ...extraStys }}
          onClick={ev => this.cellClickHandle(ev, row, column)}
          onDblclick={ev => this.cellDbclickHandle(ev, row, column)}
        >
          <div class="v-cell">{this.renderCell(column, row, rowKey)}</div>
        </td>
      );
    },
    renderCell(column, row, rowKey) {
      const { dataIndex } = column;
      if (dataIndex === '__selection__') {
        return <Selection column={column} record={row} rowKey={rowKey} />;
      }
      return getCellValue(row, column.dataIndex);
    },
    getSpan(row, column, rowIndex, columnIndex) {
      let rowspan = 1;
      let colspan = 1;
      const fn = this.$$table.spanMethod;
      if (_.isFunction(fn)) {
        const result = fn({ row, column, rowIndex, columnIndex });
        if (Array.isArray(result)) {
          rowspan = result[0];
          colspan = result[1];
        } else if (_.isObject(result)) {
          rowspan = result.rowspan;
          colspan = result.colspan;
        }
      }
      return { rowspan, colspan };
    },
    cellClickHandle(ev, row, column) {
      if (column.dataIndex === '__selection__') return;
      this.$$table.$emit('rowClick', row, column, ev);
    },
    cellDbclickHandle(ev, row, column) {
      if (column.dataIndex === '__selection__') return;
      this.$$table.$emit('rowDblclick', row, column, ev);
    }
  },
  render() {
    const { bodyWidth, wrapStyle } = this;
    return (
      <div class="v-table--body-wrapper body--wrapper" style={{ ...wrapStyle }}>
        {this.renderBodyYSpace()}
        <table class="v-table--body" cellspacing="0" cellpadding="0" border="0" style={{ width: bodyWidth }}>
          {this.renderColgroup()}
          <tbody>{this.renderRows()}</tbody>
        </table>
      </div>
    );
  }
};
