/*
 * @Author: 焦质晔
 * @Date: 2020-02-28 23:01:43
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-02 19:27:28
 */
import { mapState, mapActions } from 'vuex';
import { parseHeight } from '../utils';
import _ from 'lodash';

export default {
  name: 'TableBody',
  props: ['tableData', 'flatColumns', 'layout', 'uidkey'],
  inject: ['$$table'],
  daya() {
    this.prevST = 0;
    this.prevSL = 0;
    return {};
  },
  computed: {
    bodyWidth() {
      const { tableBodyWidth, gutterWidth } = this.layout;
      return tableBodyWidth ? `${tableBodyWidth - (this.$$table.scrollY ? gutterWidth : 0)}px` : null;
    },
    wrapStyle() {
      const { headerHeight, viewportHeight, footerHeight } = this.layout;
      let { height, maxHeight } = this.$$table;
      if (height) {
        return {
          height: `${viewportHeight}px`
        };
      }
      if (maxHeight) {
        maxHeight = parseHeight(maxHeight);
        if (typeof maxHeight === 'number') {
          return {
            'max-height': `${maxHeight - footerHeight - headerHeight}px`
          };
        }
      }
      return null;
    }
  },
  mounted() {
    this.$el.onscroll = this.scrollEvent;
  },
  destroyed() {
    this.$el.onscroll = null;
  },
  methods: {
    renderRows() {
      const rows = this.tableData.map(row => (
        <tr key={row[this.uidkey]} class="v-body--row">
          {this.flatColumns.map(column => this.renderCells(column, row))}
        </tr>
      ));
      return rows;
    },
    renderCells(column, row) {
      return (
        <td key={column.dataIndex} class="v-body--column">
          <div class="v-cell">{_.get(row, column.dataIndex)}</div>
        </td>
      );
    },
    scrollEvent(ev) {
      const { scrollYLoad, $refs } = this.$$table;
      const { tableHeader, tableFooter } = $refs;
      const { scrollTop: st, scrollLeft: sl } = ev.target;
      if (sl !== this.prevSL) {
        if (tableHeader) {
          tableHeader.$el.scrollLeft = sl;
        }
        if (tableFooter) {
          tableFooter.$el.scrollLeft = sl;
        }
      }
      if (scrollYLoad && st !== this.prevST) {
        this.$$table.triggerScrollYEvent(ev);
      }
      this.prevST = st;
      this.prevSL = sl;
    },
    renderBodyYSpace() {
      return <div class="v-body--y-space" />;
    }
  },
  render() {
    const { $$table, flatColumns, bodyWidth, wrapStyle } = this;
    return (
      <div class="v-table--body-wrapper body--wrapper" style={{ ...wrapStyle }}>
        {this.renderBodyYSpace()}
        <table ref="vTableBody" class="v-table--body" cellspacing="0" cellpadding="0" border="0" style={{ width: bodyWidth }}>
          <colgroup>
            {flatColumns.map(column => (
              <col key={column.dataIndex} style={{ width: `${column.width || column.renderWidth}px`, minWidth: `${column.width || column.renderWidth}px` }} />
            ))}
          </colgroup>
          <tbody>{this.renderRows()}</tbody>
        </table>
      </div>
    );
  }
};
