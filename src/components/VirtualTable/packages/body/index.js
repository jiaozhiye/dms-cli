/*
 * @Author: 焦质晔
 * @Date: 2020-02-28 23:01:43
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-13 13:41:51
 */
import addEventListener from 'add-dom-event-listener';
import { parseHeight, getCellValue, contains } from '../utils';
import config from '../config';
import { isEqual, isFunction, isObject } from 'lodash';

import formatMixin from './format';
import keyboardMixin from './keyboard';

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
  mixins: [keyboardMixin, formatMixin],
  data() {
    this.prevST = 0;
    this.prevSL = 0;
    return {
      clicked: [], // 被点击单元格的坐标
      checked: [] // 可选择列选中的 rowKey
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
      const { layout, height, maxHeight, fullHeight, autoHeight, isTableEmpty } = this.$$table;
      const { headerHeight, viewportHeight, footerHeight } = layout;
      if (fullHeight || autoHeight || height) {
        return { height: `${viewportHeight}px` };
      }
      if (isTableEmpty) {
        return { minHeight: `100px` };
      }
      if (maxHeight) {
        const maxTableHeight = parseHeight(maxHeight);
        if (typeof maxTableHeight === 'number') {
          return { maxHeight: `${maxTableHeight - headerHeight - footerHeight}px` };
        }
      }
      return null;
    },
    editableColumns() {
      return this.flattenColumns.filter(x => isFunction(x.editRender));
    },
    firstDataIndex() {
      const effectColumns = this.flattenColumns.filter(x => !['__expandable__', '__selection__', config.operationColumn].includes(x.dataIndex));
      return effectColumns.length ? effectColumns[0].dataIndex : '';
    },
    isTreeTable() {
      return this.tableData.some(x => Array.isArray(x.children) && x.children.length);
    }
  },
  mounted() {
    this.event1 = addEventListener(this.$el, 'scroll', this.scrollEvent);
    this.event2 = addEventListener(document.body, 'click', this.cancelEvent);
    this.event3 = addEventListener(document, 'keydown', this.keyboardEvent);
  },
  destroyed() {
    this.event1.remove();
    this.event2.remove();
    this.event3.remove();
  },
  methods: {
    scrollEvent(ev) {
      const { scrollYLoad, scrollY, layout, triggerScrollYEvent, $refs } = this.$$table;
      const scrollYWidth = scrollY ? layout.gutterWidth : 0;
      const { scrollTop: st, scrollLeft: sl } = ev.target;
      if (sl !== this.prevSL) {
        if ($refs[`tableHeader`]) {
          $refs[`tableHeader`].$el.scrollLeft = sl;
        }
        if ($refs[`tableFooter`]) {
          $refs[`tableFooter`].$el.scrollLeft = sl;
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
    cancelEvent(ev) {
      const { target, currentTarget } = ev;
      if (target === currentTarget) return;
      if (target.className === 'v-cell--text' || contains(this.$vTableBody, target)) return;
      this.setClickedValues([]);
    },
    renderBodyXSpace() {
      return <div class="v-body--x-space" style={{ width: this.bodyWidth }} />;
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
    renderRows(list, depth = 0) {
      const { getRowKey, selectionKeys, expandable, rowExpandedKeys, ellipsis } = this.$$table;
      const rows = [];
      list.forEach(row => {
        // 行记录 索引
        const rowIndex = row.index;
        // 行记录 rowKey
        const rowKey = getRowKey(row, rowIndex);
        const cls = [
          `v-body--row`,
          {
            [`v-body--row-selected`]: selectionKeys.includes(rowKey)
          }
        ];
        rows.push(
          <tr key={rowKey} data-row-key={rowKey} class={cls}>
            {this.flattenColumns.map((column, columnIndex) => this.renderColumn(column, columnIndex, row, rowIndex, rowKey, depth))}
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
          // 展开状态
          if (!rowExpandable(row) && rowExpandedKeys.includes(rowKey)) {
            rows.push(
              <tr key={`expand_${rowKey}`} class="v-body--expanded-row">
                <td colspan={this.flattenColumns.length} class={expandColumnCls}>
                  <div class="v-cell">{expandable.expandedRowRender(row)}</div>
                </td>
              </tr>
            );
          }
        }
        // 树表格
        if (this.isTreeNode(row)) {
          // 展开状态
          if (rowExpandedKeys.includes(rowKey)) {
            rows.push(...this.renderRows(row.children, depth + 1));
          }
        }
      });
      return rows;
    },
    renderColumn(column, columnIndex, row, rowIndex, rowKey, depth) {
      const { leftFixedColumns, rightFixedColumns, getStickyLeft, getStickyRight, ellipsis, isIE } = this.$$table;
      const { dataIndex, fixed, align, className, orderBy } = column;
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
          [`v-column--sort`]: !!orderBy,
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
      const trExtraStys = this.rowStyle ? (isFunction(this.rowStyle) ? this.rowStyle(row, rowIndex) : this.rowStyle) : null;
      const tdExtraStys = this.cellStyle ? (isFunction(this.cellStyle) ? this.cellStyle(row, column, rowIndex, columnIndex) : this.cellStyle) : null;
      return (
        <td
          key={dataIndex}
          title={isEllipsis && this.renderText(getCellValue(row, dataIndex), column, row)}
          rowspan={rowspan}
          colspan={colspan}
          class={cls}
          style={{ ...stys, ...trExtraStys, ...tdExtraStys }}
          onClick={ev => this.cellClickHandle(ev, row, column)}
          onDblclick={ev => this.cellDbclickHandle(ev, row, column)}
        >
          <div class="v-cell">{this.renderCell(column, row, rowIndex, columnIndex, rowKey, depth)}</div>
        </td>
      );
    },
    renderCell(column, row, rowIndex, columnIndex, rowKey, depth) {
      const { expandable, selectionKeys } = this.$$table;
      const { dataIndex, editRender, render } = column;
      const text = getCellValue(row, dataIndex);
      if (dataIndex === '__expandable__') {
        const { rowExpandable = noop } = expandable;
        // Expandable -> 受控组件
        return !rowExpandable(row) && <Expandable record={row} rowKey={rowKey} />;
      }
      if (dataIndex === '__selection__') {
        // Selection -> 受控组件
        return <Selection selectionKeys={selectionKeys} column={column} record={row} rowKey={rowKey} />;
      }
      if (isFunction(editRender)) {
        // CellEdit -> UI 组件，无状态组件
        return <CellEdit column={column} record={row} rowKey={rowKey} columnKey={dataIndex} clicked={this.clicked} />;
      }
      // Content Node
      const vNodeText = isFunction(render) ? render(text, row, column, rowIndex, columnIndex) : this.renderText(text, column, row);
      // Tree Expandable + vNodeText
      if (this.isTreeTable && dataIndex === this.firstDataIndex) {
        return [this.renderIndent(depth), <Expandable record={row} rowKey={rowKey} style={this.isTreeNode(row) ? null : { visibility: 'hidden' }} />, vNodeText];
      }
      return vNodeText;
    },
    renderText(text, column, row) {
      const { dictItems, formatType, editRender } = column;
      const dicts = dictItems || editRender?.(row, column)?.items || [];
      const target = dicts.find(x => x.value == text);
      let result = target?.text ?? text;
      // 数据是数组的情况
      if (Array.isArray(text)) {
        result = text
          .map(x => {
            let target = dicts.find(k => k.value == x);
            return target?.text ?? x;
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
    renderIndent(level) {
      return level ? <span class={`v-cell--indent indent-level-${level}`} style={{ paddingLeft: `${level * config.treeTable.textIndent}px` }} /> : null;
    },
    getSpan(row, column, rowIndex, columnIndex) {
      let rowspan = 1;
      let colspan = 1;
      const fn = this.$$table.spanMethod;
      if (isFunction(fn)) {
        const result = fn({ row, column, rowIndex, columnIndex });
        if (Array.isArray(result)) {
          rowspan = result[0];
          colspan = result[1];
        } else if (isObject(result)) {
          rowspan = result.rowspan;
          colspan = result.colspan;
        }
      }
      return { rowspan, colspan };
    },
    cellClickHandle(ev, row, column) {
      const { getRowKey, rowSelection = {}, selectionKeys } = this.$$table;
      const { dataIndex } = column;
      const rowKey = getRowKey(row, row.index);
      if (['__expandable__', config.operationColumn].includes(dataIndex)) return;
      // 不可编辑单元格
      if (!column.editRender) {
        let { type, disabled = noop } = rowSelection;
        if (type && !disabled(row)) {
          if (type === 'radio') {
            this.setSelectionKeys([rowKey]);
          }
          if (type === 'checkbox') {
            this.setSelectionKeys(!selectionKeys.includes(rowKey) ? [...new Set([...selectionKeys, rowKey])] : selectionKeys.filter(x => x !== rowKey));
          }
        }
      }
      // 单击 展开列、可选择列、操作列 不触发行单击事件
      if (['__selection__'].includes(dataIndex)) return;
      this.setClickedValues([rowKey, dataIndex]);
      this.$$table.$emit('rowClick', row, column, ev);
    },
    cellDbclickHandle(ev, row, column) {
      const { dataIndex } = column;
      if (['__expandable__', '__selection__', config.operationColumn].includes(dataIndex)) return;
      this.$$table.$emit('rowDblclick', row, column, ev);
    },
    setClickedValues(arr) {
      if (isEqual(arr, this.clicked)) return;
      this.clicked = arr;
    },
    setSelectionKeys(arr) {
      this.$$table.selectionKeys = arr;
    },
    isTreeNode(row) {
      return Array.isArray(row.children) && row.children.length > 0;
    }
  },
  render() {
    const { bodyWidth, wrapStyle, tableData } = this;
    return (
      <div class="v-table--body-wrapper body--wrapper" style={{ ...wrapStyle }}>
        {this.renderBodyYSpace()}
        {this.renderBodyXSpace()}
        <table class="v-table--body" cellspacing="0" cellpadding="0" border="0" style={{ width: bodyWidth }}>
          {this.renderColgroup()}
          <tbody>{this.renderRows(tableData)}</tbody>
        </table>
      </div>
    );
  }
};
