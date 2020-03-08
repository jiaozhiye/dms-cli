/*
 * @Author: 焦质晔
 * @Date: 2020-03-01 23:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-08 09:46:50
 */
import { mapState, mapActions } from 'vuex';
import _ from 'lodash';
import { formatNumber } from '../utils';

export default {
  name: 'TableFooter',
  props: ['flattenColumns'],
  inject: ['$$table'],
  computed: {
    summationRows() {
      const { dataSource } = this.$$table;
      const summationColumns = this.flattenColumns.filter(x => typeof x.summation !== 'undefined');
      // 结果
      const res = {};
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
            return <col key={dataIndex} style={{ width: `${width || renderWidth}px` }} />;
          })}
          {scrollY && <col style={{ width: `${gutterWidth}px` }} />}
        </colgroup>
      );
    },
    renderRows() {
      const { scrollY } = this.$$table;
      return this.summationRows.map(row => (
        <tr class="v-footer--row">
          {this.flattenColumns.map((column, index) => this.renderCell(column, row, index))}
          {scrollY && <td class="gutter"></td>}
        </tr>
      ));
    },
    renderCell(column, row, index) {
      const {
        leftFixedColumns,
        rightFixedColumns,
        getStickyLeft,
        getStickyRight,
        layout: { gutterWidth },
        scrollY
      } = this.$$table;
      const { dataIndex, fixed } = column;
      const cls = [
        `v-footer--column`,
        {
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
      return (
        <td key={dataIndex} class={cls} style={{ ...stys }}>
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
