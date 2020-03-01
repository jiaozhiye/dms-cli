/*
 * @Author: 焦质晔
 * @Date: 2020-03-01 23:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-02 01:04:06
 */
import { mapState, mapActions } from 'vuex';
import _ from 'lodash';
import { formatNumber } from '../utils';

export default {
  name: 'TableFooter',
  props: ['dataSource', 'flatColumns', 'layout', 'uidkey'],
  inject: ['$$table'],
  computed: {
    summationRows() {
      const { $$table, dataSource } = this;
      const summationColumns = this.flatColumns.filter(x => typeof x.summation !== 'undefined');
      // 结果
      const res = { [$$table.uidkey]: 1 };
      summationColumns.forEach(column => {
        const {
          dataIndex,
          precision,
          summation: { unit = '' }
        } = column;
        const values = dataSource.map(x => Number(_.get(x, dataIndex, 0)));
        // 累加求和
        let result = values.reduce((prev, curr) => {
          const value = Number(curr);
          if (!isNaN(value)) {
            return prev + curr;
          }
          return prev;
        }, 0);
        // 精度
        result = precision >= 0 ? result.toFixed(precision) : result;
        _.set(res, dataIndex, `${formatNumber(result)} ${unit}`);
      });
      return [res];
    }
  },
  methods: {
    renderRows() {
      return this.summationRows.map(row => (
        <tr key={row[this.uidkey]} class="v-footer--row">
          {this.flatColumns.map((column, index) => this.renderCells(column, row, index))}
          {this.$$table.scrollY && <td class="gutter"></td>}
        </tr>
      ));
    },
    renderCells(column, row, index) {
      return (
        <td key={column.dataIndex} class="v-footer--column">
          <div class="v-cell">{index > 0 ? _.get(row, column.dataIndex, '') : '合计'}</div>
        </td>
      );
    }
  },
  render() {
    const { $$table, flatColumns, layout } = this;
    return (
      <div class="v-table--footer-wrapper body--wrapper">
        <table class="v-table--footer" cellspacing="0" cellpadding="0" border="0" style={{ width: layout.tableBodyWidth ? `${layout.tableBodyWidth}px` : null }}>
          <colgroup>
            {flatColumns.map(column => (
              <col key={column.dataIndex} style={{ width: `${column.width}px`, minWidth: `${column.width}px` }} />
            ))}
            {$$table.scrollY && <col name="gutter" style={{ width: `${layout.gutterWidth}px` }} />}
          </colgroup>
          <tfoot>{this.renderRows()}</tfoot>
        </table>
      </div>
    );
  }
};
