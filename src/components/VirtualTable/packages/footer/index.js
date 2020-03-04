/*
 * @Author: 焦质晔
 * @Date: 2020-03-01 23:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-03 12:36:14
 */
import { mapState, mapActions } from 'vuex';
import _ from 'lodash';
import { formatNumber } from '../utils';

export default {
  name: 'TableFooter',
  props: ['dataSource', 'flattenColumns', 'uidkey'],
  inject: ['$$table'],
  computed: {
    summationRows() {
      const { dataSource } = this;
      const summationColumns = this.flattenColumns.filter(x => typeof x.summation !== 'undefined');
      // 结果
      const res = { [this.$$table.uidkey]: 1 };
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
          {scrollY && <col name="gutter" style={{ width: `${gutterWidth}px` }} />}
        </colgroup>
      );
    },
    renderRows() {
      const { scrollY } = this.$$table;
      return this.summationRows.map(row => (
        <tr key={row[this.uidkey]} class="v-footer--row">
          {this.flattenColumns.map((column, index) => this.renderCell(column, row, index))}
          {scrollY && <td class="gutter"></td>}
        </tr>
      ));
    },
    renderCell(column, row, index) {
      return (
        <td key={column.dataIndex} class="v-footer--column">
          <div class="v-cell">{index > 0 ? _.get(row, column.dataIndex, '') : '合计'}</div>
        </td>
      );
    }
  },
  render() {
    const {
      layout: { tableBodyWidth }
    } = this.$$table;
    return (
      <div class="v-table--footer-wrapper body--wrapper">
        <table class="v-table--footer" cellspacing="0" cellpadding="0" border="0" style={{ width: tableBodyWidth ? `${tableBodyWidth}px` : null }}>
          {this.renderColgroup()}
          <tfoot>{this.renderRows()}</tfoot>
        </table>
      </div>
    );
  }
};
