/*
 * @Author: 焦质晔
 * @Date: 2020-02-28 23:01:43
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-24 10:15:37
 */
import { mapState, mapActions } from 'vuex';
import addEventListener from 'add-dom-event-listener';
import { parseHeight, getCellValue, contains } from '../utils';
import config from '../config';
import _ from 'lodash';

import formatMixin from './format';

import Selection from '../selection';
import CellEdit from '../edit';

export default {
  name: 'TableBody',
  props: ['flattenColumns', 'tableData', 'rowStyle', 'cellStyle'],
  inject: ['$$table'],
  provide() {
    return {
      $$body: this
    };
  },
  mixins: [formatMixin],
  data() {
    this.prevST = 0;
    this.prevSL = 0;
    return {
      clicked: [] // 被点击单元格的坐标
    };
  },
  computed: {
    $vTableBody() {
      return this.$el.querySelector('.v-table--body');
    },
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
    this.event1 = addEventListener(this.$el, 'scroll', this.scrollEvent);
    this.event2 = addEventListener(document, 'click', this.clickEvent);
  },
  destroyed() {
    this.event1.remove();
    this.event2.remove();
  },
  methods: {
    scrollEvent(ev) {
      const { scrollYLoad, $refs, layout, triggerScrollYEvent } = this.$$table;
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
        triggerScrollYEvent(ev);
      }
      this.prevST = st;
      this.prevSL = sl;
    },
    clickEvent({ target }) {
      if (contains(this.$vTableBody, target)) return;
      this.setClickedHandle([]);
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
      const { getRowKey, selectionKeys } = this.$$table;
      const rows = this.tableData.map(row => {
        // 行记录 索引
        const rowIndex = row.index;
        // 行记录 rowKey
        const rowKey = getRowKey(row, rowIndex);
        const extraStys = this.rowStyle ? (_.isFunction(this.rowStyle) ? this.rowStyle(row, rowIndex) : this.rowStyle) : null;
        const cls = [
          `v-body--row`,
          {
            [`v-body--row-selected`]: selectionKeys.includes(rowKey)
          }
        ];
        return (
          <tr key={rowKey} data-row-key={rowKey} class={cls} style={extraStys}>
            {this.flattenColumns.map((column, columnIndex) => this.renderColumn(column, columnIndex, row, rowIndex, rowKey))}
          </tr>
        );
      });
      return rows;
    },
    renderColumn(column, columnIndex, row, rowIndex, rowKey) {
      const { sorter, leftFixedColumns, rightFixedColumns, getStickyLeft, getStickyRight, ellipsis, isIE } = this.$$table;
      const { dataIndex, fixed, align, className } = column;
      const { rowspan, colspan } = this.getSpan(row, column, rowIndex, columnIndex);
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
      const extraStys = this.cellStyle ? (_.isFunction(this.cellStyle) ? this.cellStyle(row, column, rowIndex, columnIndex) : this.cellStyle) : null;
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
          <div class="v-cell">{this.renderCell(column, row, rowIndex, columnIndex, rowKey)}</div>
        </td>
      );
    },
    renderCell(column, row, rowIndex, columnIndex, rowKey) {
      const { dataIndex, editRender, render } = column;
      const text = getCellValue(row, dataIndex);
      if (dataIndex === '__selection__') {
        return <Selection column={column} record={row} rowKey={rowKey} />;
      }
      if (_.isFunction(editRender)) {
        return <CellEdit column={column} record={row} rowKey={rowKey} columnKey={dataIndex} clicked={this.clicked} />;
      }
      if (_.isFunction(render)) {
        return render(text, row, column, rowIndex, columnIndex);
      }
      return this.renderText(text, column);
    },
    renderText(text, column) {
      const { dictItems, formatType } = column;
      const dicts = dictItems || [];
      const target = dicts.find(x => x.value == text);
      let result = target ? target.text : text;
      // 数据是数组的情况
      if (Array.isArray(text)) {
        result = text
          .map(x => {
            let target = dicts.find(k => k.value == x);
            return target ? target.text : x;
          })
          .join(',');
      }
      // 处理数据格式化
      if (formatType) {
        const render = this[`${formatType}Format`];
        if (!render) {
          console.error('[Table]: 字段的格式化类型 `formatType` 配置不正确');
        } else {
          result = render(text);
        }
      }
      return result;
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
      ev.stopPropagation();
      const { getRowKey } = this.$$table;
      const { dataIndex } = column;
      if (dataIndex === '__selection__' || dataIndex === config.operationColumn) return;
      this.setClickedHandle([getRowKey(row, row.index), dataIndex]);
      this.$$table.$emit('rowClick', row, column, ev);
    },
    cellDbclickHandle(ev, row, column) {
      ev.stopPropagation();
      const { dataIndex } = column;
      if (dataIndex === '__selection__' || dataIndex === config.operationColumn) return;
      this.$$table.$emit('rowDblclick', row, column, ev);
    },
    setClickedHandle(arr) {
      if (_.isEqual(arr, this.clicked)) return;
      this.clicked = arr;
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
