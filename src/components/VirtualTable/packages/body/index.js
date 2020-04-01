/*
 * @Author: 焦质晔
 * @Date: 2020-02-28 23:01:43
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-01 12:41:00
 */
import addEventListener from 'add-dom-event-listener';
import { parseHeight, getCellValue, contains } from '../utils';
import config from '../config';
import _ from 'lodash';

import formatMixin from './format';

import Expandable from '../expandable';
import Selection from '../selection';
import CellEdit from '../edit';

const noop = () => {};

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
      const { layout, height, maxHeight, calcHeight } = this.$$table;
      const { headerHeight, viewportHeight, footerHeight } = layout;
      if (calcHeight || height) {
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
    },
    editable() {
      return this.flattenColumns.some(x => _.isFunction(x.editRender));
    }
  },
  mounted() {
    this.event1 = addEventListener(this.$el, 'scroll', this.scrollEvent);
    this.event2 = addEventListener(document, 'click', this.clickEvent);
    this.event3 = addEventListener(document, 'keydown', this.keyboardEvent);
  },
  destroyed() {
    this.event1.remove();
    this.event2.remove();
    this.event3.remove();
  },
  methods: {
    scrollEvent(ev) {
      const { scrollYLoad, $$tableHeader, $$tableFooter, scrollY, layout, triggerScrollYEvent } = this.$$table;
      const scrollYWidth = scrollY ? layout.gutterWidth : 0;
      const { scrollTop: st, scrollLeft: sl } = ev.target;
      if (sl !== this.prevSL) {
        if ($$tableHeader) {
          $$tableHeader.$el.scrollLeft = sl;
        }
        if ($$tableFooter) {
          $$tableFooter.$el.scrollLeft = sl;
        }
        this.$$table.isPingLeft = sl > 0;
        this.$$table.isPingRight = sl + layout.tableWidth < layout.tableBodyWidth + scrollYWidth;
      }
      if (scrollYLoad && st !== this.prevST) {
        triggerScrollYEvent(ev);
      }
      this.prevST = st;
      this.prevSL = sl;
    },
    keyboardEvent(ev) {
      if (this.editable) return;
      // 至少一个单元格获得焦点
      if (!this.clicked.length) return;
      // 逻辑...
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
      const { getRowKey, selectionKeys, expandable, rowExpandedKeys, ellipsis } = this.$$table;
      const rows = [];
      this.tableData.forEach(row => {
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
        rows.push(
          <tr key={rowKey} data-row-key={rowKey} class={cls} style={extraStys}>
            {this.flattenColumns.map((column, columnIndex) => this.renderColumn(column, columnIndex, row, rowIndex, rowKey))}
          </tr>
        );
        // 展开行
        if (expandable) {
          const { rowExpandable = noop } = expandable;
          const expandColumnCls = [
            `v-body--expanded-column`,
            {
              [`col--ellipsis`]: ellipsis
            }
          ];
          if (!rowExpandable(row) && rowExpandedKeys.includes(rowKey)) {
            rows.push(
              <tr key={`expand_${rowKey}`} class="v-body--expanded-row" style={extraStys}>
                <td colspan={this.flattenColumns.length} class={expandColumnCls}>
                  <div class="v-cell">{expandable.expandedRowRender(row)}</div>
                </td>
              </tr>
            );
          }
        }
      });
      return rows;
    },
    renderColumn(column, columnIndex, row, rowIndex, rowKey) {
      const { leftFixedColumns, rightFixedColumns, getStickyLeft, getStickyRight, ellipsis, isIE } = this.$$table;
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
          [`v-column--sort`]: this.isColumnSorter(column),
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
          title={isEllipsis && this.renderText(getCellValue(row, dataIndex), column)}
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
      const { expandable } = this.$$table;
      const { dataIndex, editRender, render } = column;
      const text = getCellValue(row, dataIndex);
      if (dataIndex === '__expandable__') {
        const { rowExpandable = noop } = expandable;
        // Expandable -> 受控组件
        return !rowExpandable(row) ? <Expandable record={row} rowKey={rowKey} /> : null;
      }
      if (dataIndex === '__selection__') {
        // Selection -> 受控组件
        return <Selection ref="selection" column={column} record={row} rowKey={rowKey} />;
      }
      if (_.isFunction(editRender)) {
        // CellEdit -> UI 组件，无状态组件
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
      const { getRowKey, rowSelection, selectionKeys } = this.$$table;
      const { dataIndex } = column;
      const rowKey = getRowKey(row, row.index);
      if (['__expandable__', config.operationColumn].includes(dataIndex)) return;
      // 处理选择列
      if (dataIndex === '__selection__') {
        const { type, rowSelectable = noop } = rowSelection;
        if (rowSelectable(row)) return;
        if (type === 'radio') {
          return this.$refs['selection'].setRowSelection(rowKey);
        }
        if (type === 'checkbox') {
          return this.$refs['selection'].toggleRowSelection(rowKey, !selectionKeys.includes(rowKey));
        }
      }
      this.setClickedHandle([rowKey, dataIndex]);
      this.$$table.$emit('rowClick', row, column, ev);
    },
    cellDbclickHandle(ev, row, column) {
      ev.stopPropagation();
      const { dataIndex } = column;
      if (['__expandable__', '__selection__', config.operationColumn].includes(dataIndex)) return;
      this.$$table.$emit('rowDblclick', row, column, ev);
    },
    setClickedHandle(arr) {
      if (_.isEqual(arr, this.clicked)) return;
      this.clicked = arr;
    },
    isColumnSorter(column) {
      const { sorter } = this.$$table;
      return Object.values(sorter).length && Object.values(sorter)[0].split('|')[0] === column.dataIndex;
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
