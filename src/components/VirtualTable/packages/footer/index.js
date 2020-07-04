/*
 * @Author: 焦质晔
 * @Date: 2020-03-01 23:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-06-30 13:37:01
 */
import { formatNumber, setCellValue, getCellValue } from '../utils';
import config from '../config';

const noop = () => {};

export default {
  name: 'TableFooter',
  props: ['flattenColumns'],
  inject: ['$$table'],
  computed: {
    summationRows() {
      const { tableFullData, summaries } = this.$$table;
      const summationColumns = this.flattenColumns.filter(x => typeof x.summation !== 'undefined');
      // 结果
      const res = {};
      summationColumns.forEach(column => {
        const {
          dataIndex,
          precision,
          summation: { unit = '', onChange = noop }
        } = column;
        const values = tableFullData.map(x => Number(getCellValue(x, dataIndex)));
        // 累加求和
        let result = values.reduce((prev, curr) => {
          const value = Number(curr);
          if (!Number.isNaN(value)) {
            return prev + curr;
          }
          return prev;
        }, 0);
        // 服务端合计
        if (Object.keys(summaries).includes(dataIndex)) {
          result = getCellValue(summaries, dataIndex);
        }
        result = precision >= 0 ? result.toFixed(precision) : result;
        // 设置合计值
        setCellValue(res, dataIndex, `${formatNumber(result)} ${unit}`);
        // 触发事件
        onChange(result);
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
          {scrollY && <col style={{ width: `${gutterWidth}px`, minWidth: `${gutterWidth}px` }} />}
        </colgroup>
      );
    },
    renderRows() {
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
      return this.summationRows.map(row => (
        <tr class="v-footer--row">
          {this.flattenColumns.map((column, index) => this.renderCell(column, row, index))}
          {scrollY && <td class={cls} style={stys}></td>}
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
        scrollY,
        isIE
      } = this.$$table;
      const { dataIndex, fixed, align } = column;
      const cls = [
        `v-footer--column`,
        `col--ellipsis`,
        {
          [`col--center`]: align === 'center',
          [`col--right`]: align === 'right',
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
      const text = getCellValue(row, dataIndex);
      return (
        <td key={dataIndex} class={cls} style={{ ...stys }}>
          <div class="v-cell">{index === 0 && text === '' ? config.summaryText() : text}</div>
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
