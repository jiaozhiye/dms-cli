/*
 * @Author: 焦质晔
 * @Date: 2020-02-28 23:01:43
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-05 15:47:47
 */
import { mapState, mapActions } from 'vuex';
import { getOffsetPos, deepFindColumn } from '../utils';

const getAllColumns = columns => {
  const result = [];
  columns.forEach(column => {
    if (column.children) {
      result.push(column);
      result.push.apply(result, getAllColumns(column.children));
    } else {
      result.push(column);
    }
  });
  return result;
};

const convertToRows = originColumns => {
  let maxLevel = 1;
  const traverse = (column, parent) => {
    if (parent) {
      column.level = parent.level + 1;
      if (maxLevel < column.level) {
        maxLevel = column.level;
      }
    }
    if (column.children) {
      let colSpan = 0;
      column.children.forEach(subColumn => {
        traverse(subColumn, column);
        colSpan += subColumn.colSpan;
      });
      column.colSpan = colSpan;
    } else {
      column.colSpan = 1;
    }
  };

  originColumns.forEach(column => {
    column.level = 1;
    traverse(column);
  });

  const rows = [];
  for (let i = 0; i < maxLevel; i++) {
    rows.push([]);
  }

  const allColumns = getAllColumns(originColumns);

  allColumns.forEach(column => {
    if (!column.children) {
      column.rowSpan = maxLevel - column.level + 1;
    } else {
      column.rowSpan = 1;
    }
    rows[column.level - 1].push(column);
  });

  return rows;
};

export default {
  name: 'TableHeader',
  props: ['tableColumns', 'flattenColumns'],
  inject: ['$$table'],
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
    renderRows(columnRows) {
      const { scrollY } = this.$$table;
      return columnRows.map((columns, rowIndex) => (
        <tr key={rowIndex} class="v-header--row">
          {columns.map((column, cellIndex) => this.renderCell(column))}
          {scrollY && <th class="gutter"></th>}
        </tr>
      ));
    },
    renderCell(column) {
      const {
        leftFixedColumns,
        rightFixedColumns,
        layout: { gutterWidth },
        resizable,
        bordered,
        scrollY
      } = this.$$table;

      const cls = [
        `v-header--column`,
        {
          [`v-cell-fix-left`]: column.fixed === 'left',
          [`v-cell-fix-right`]: column.fixed === 'right',
          [`v-cell-fix-left-last`]: column.fixed === 'left' && leftFixedColumns[leftFixedColumns.length - 1].dataIndex === column.dataIndex,
          [`v-cell-fix-right-first`]: column.fixed === 'right' && rightFixedColumns[0].dataIndex === column.dataIndex
        }
      ];
      const stys = {
        left: column.fixed === 'left' ? `${this.$$table.getStickyLeft(column.dataIndex)}px` : null,
        right: column.fixed === 'right' ? `${this.$$table.getStickyRight(column.dataIndex) + scrollY ? gutterWidth : 0}px` : null
      };
      const resizableCls = [
        `v-resizable`,
        {
          [`is--line`]: resizable && !bordered
        }
      ];
      return (
        <th key={column.dataIndex} class={cls} style={{ ...stys }} colspan={column.colSpan} rowspan={column.rowSpan}>
          <div class="v-cell">{column.title}</div>
          {this.$$table.resizable && <div class={resizableCls} onMousedown={ev => this.resizeMousedown(ev, column)} />}
        </th>
      );
    },
    resizeMousedown(ev, column) {
      const dom = ev.target;
      const { $vTable, $refs, defaultColumnWidth } = this.$$table;
      const $tableBody = $refs[`tableBody`].$el;
      const target = $refs[`resizable-bar`];

      const half = dom.offsetWidth / 2 - 1;
      const disX = ev.clientX;
      const left = getOffsetPos(dom, $vTable).left - $tableBody.scrollLeft + half;

      $vTable.classList.add('c--resize');
      target.style.left = `${left}px`;
      target.style.display = 'block';

      // 操作表格列 -> 违背了单向数据流原则，后期建议优化
      const tColumn = deepFindColumn(this.flattenColumns, column.dataIndex);
      const renderWidth = tColumn.width || tColumn.renderWidth;

      document.onmousemove = ev => {
        let ml = ev.clientX - disX;
        let rw = renderWidth + ml;

        // 左边界限定
        if (rw < defaultColumnWidth) return;

        tColumn.width = tColumn.renderWidth = rw;
        target.style.left = `${ml + left}px`;
      };

      document.onmouseup = function() {
        $vTable.classList.remove('c--resize');
        target.style.display = 'none';
        this.onmousemove = null;
        this.onmouseup = null;
      };

      return false;
    }
  },
  render() {
    const { tableColumns } = this;
    const {
      layout: { tableBodyWidth }
    } = this.$$table;
    const columnRows = convertToRows(tableColumns);
    // 是否拥有多级表头
    this.$$table.isGroup = columnRows.length > 1;
    return (
      <div class="v-table--header-wrapper">
        <table class="v-table--header" cellspacing="0" cellpadding="0" border="0" style={{ width: tableBodyWidth ? `${tableBodyWidth}px` : null }}>
          {this.renderColgroup()}
          <thead>{this.renderRows(columnRows)}</thead>
        </table>
      </div>
    );
  }
};
