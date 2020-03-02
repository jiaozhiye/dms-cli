/*
 * @Author: 焦质晔
 * @Date: 2020-02-28 23:01:43
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-03 00:41:52
 */
import { mapState, mapActions } from 'vuex';

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
  props: ['tableColumns', 'flatColumns'],
  inject: ['$$table'],
  methods: {
    renderColgroup() {
      const {
        layout: { gutterWidth },
        scrollY
      } = this.$$table;
      return (
        <colgroup>
          {this.flatColumns.map(column => {
            const { dataIndex, width, renderWidth } = column;
            return <col key={dataIndex} style={{ width: `${width || renderWidth}px`, minWidth: `${width || renderWidth}px` }} />;
          })}
          {scrollY && <col name="gutter" style={{ width: `${gutterWidth}px` }} />}
        </colgroup>
      );
    }
  },
  render() {
    const { tableColumns } = this;
    const {
      layout: { tableBodyWidth },
      scrollY
    } = this.$$table;
    const columnRows = convertToRows(tableColumns);
    // 是否拥有多级表头
    const isGroup = columnRows.length > 1;
    if (isGroup) {
      this.$$table.isGroup = true;
    }
    return (
      <div class="v-table--header-wrapper">
        <table class="v-table--header" cellspacing="0" cellpadding="0" border="0" style={{ width: tableBodyWidth ? `${tableBodyWidth}px` : null }}>
          {this.renderColgroup()}
          <thead>
            {columnRows.map((columns, rowIndex) => (
              <tr key={rowIndex} class="v-header--row">
                {columns.map((column, cellIndex) => (
                  <th key={column.dataIndex} class="v-header--column" colspan={column.colSpan} rowspan={column.rowSpan}>
                    <div class="v-cell">{column.title}</div>
                  </th>
                ))}
                {scrollY && <th class="gutter"></th>}
              </tr>
            ))}
          </thead>
        </table>
      </div>
    );
  }
};
