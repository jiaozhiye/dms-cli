/*
 * @Author: 焦质晔
 * @Date: 2020-02-28 23:01:43
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-06 13:30:34
 */
import { mapState, mapActions } from 'vuex';
import addEventListener from 'add-dom-event-listener';
import { parseHeight } from '../utils';
import _ from 'lodash';

import Selection from '../selection';

export default {
  name: 'TableBody',
  props: ['tableData', 'flattenColumns'],
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
            return <col key={dataIndex} style={{ width: `${width || renderWidth}px` }} />;
          })}
        </colgroup>
      );
    },
    renderRows() {
      const rows = this.tableData.map((row, i) => {
        const key = this.$$table.getRowKey(row, i);
        return (
          <tr key={key} data-row-key={key} class="v-body--row">
            {this.flattenColumns.map(column => this.renderColumn(column, row, key))}
          </tr>
        );
      });
      return rows;
    },
    renderColumn(column, row, rowKey) {
      const { leftFixedColumns, rightFixedColumns, getStickyLeft, getStickyRight } = this.$$table;
      const cls = [
        `v-body--column`,
        {
          [`v-cell-fix-left`]: column.fixed === 'left',
          [`v-cell-fix-right`]: column.fixed === 'right',
          [`v-cell-fix-left-last`]: column.fixed === 'left' && leftFixedColumns[leftFixedColumns.length - 1].dataIndex === column.dataIndex,
          [`v-cell-fix-right-first`]: column.fixed === 'right' && rightFixedColumns[0].dataIndex === column.dataIndex
        }
      ];
      const stys = {
        left: column.fixed === 'left' ? `${getStickyLeft(column.dataIndex)}px` : null,
        right: column.fixed === 'right' ? `${getStickyRight(column.dataIndex)}px` : null
      };
      return (
        <td key={column.dataIndex} class={cls} style={{ ...stys }}>
          <div class="v-cell">{this.renderCell(column, row, rowKey)}</div>
        </td>
      );
    },
    renderCell(column, row, rowKey) {
      const { dataIndex } = column;
      if (dataIndex === '__selection__') {
        return <Selection column={column} record={row} rowKey={rowKey} />;
      }
      return _.get(row, column.dataIndex, '');
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
