/*
 * @Author: 焦质晔
 * @Date: 2020-03-05 10:27:24
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-26 09:31:11
 */
import { deepMapColumns, createFilterColumns, deepFindColumn, findFirstColumn, findLastColumn } from '../utils';

const columnsMixin = {
  methods: {
    createTableColumns(columns) {
      const baseColumns = deepMapColumns(columns, x => {
        _.isUndefined(x.renderWidth) && this.$set(x, 'renderWidth', x.width || null);
        _.isUndefined(x.orderBy) && this.$set(x, 'orderBy', null);
      });
      const selectionColumn = this.createSelectionColumn(this.rowSelection);
      return createFilterColumns(selectionColumn ? [selectionColumn, ...baseColumns] : baseColumns);
    },
    updateColumnsWidth() {
      const tableWidth = this.$vTable.clientWidth;
      const scrollYWidth = this.scrollY ? this.layout.gutterWidth : 0;
      // 没有指定宽度的列
      let flexColumns = this.flattenColumns.filter(column => typeof column.width !== 'number');
      // 表格最小宽度
      let bodyMinWidth = 0;

      this.flattenColumns.forEach(column => {
        if (typeof column.width === 'number') {
          column.renderWidth = null;
        }
      });

      if (flexColumns.length > 0) {
        // 获取表格的最小宽度
        this.flattenColumns.forEach(column => {
          bodyMinWidth += column.width || this.defaultColumnWidth;
        });

        // 最小宽度小于容器宽度 -> 没有横向滚动条
        if (bodyMinWidth <= tableWidth - scrollYWidth) {
          this.scrollX = false;

          // 富余的宽度
          const totalFlexWidth = tableWidth - scrollYWidth - bodyMinWidth;

          if (flexColumns.length === 1 && this.resizable) {
            flexColumns[0].renderWidth = this.defaultColumnWidth + totalFlexWidth;
          } else {
            // 把富余的宽度均分给除第一列的其他列，剩下来的给第一列（避免宽度均分的时候除不尽）
            const allColumnsWidth = flexColumns.reduce((prev, column) => prev + this.defaultColumnWidth, 0);
            const flexWidthPerPixel = totalFlexWidth / allColumnsWidth;
            let noneFirstWidth = 0;

            flexColumns.forEach((column, index) => {
              if (index === 0) return;
              const flexWidth = Math.floor(this.defaultColumnWidth * flexWidthPerPixel);
              noneFirstWidth += flexWidth;
              column.renderWidth = this.defaultColumnWidth + flexWidth;
            });

            if (this.resizable) {
              flexColumns[0].renderWidth = this.defaultColumnWidth + totalFlexWidth - noneFirstWidth;
            }
          }
        } else {
          // 最小宽度大于容器宽度 -> 有横向滚动条
          this.scrollX = true;

          // 对没有设置宽度的列宽度设为默认宽度
          flexColumns.forEach(column => {
            column.renderWidth = this.defaultColumnWidth;
          });
        }

        // 表格内容宽度
        this.layout.tableBodyWidth = Math.max(bodyMinWidth, tableWidth);
      } else {
        this.flattenColumns.forEach(column => {
          column.renderWidth = column.width || this.defaultColumnWidth;
          bodyMinWidth += column.renderWidth;
        });

        this.scrollX = bodyMinWidth > tableWidth;

        // 表格内容宽度
        this.layout.tableBodyWidth = bodyMinWidth;
      }

      // 表格宽度
      this.layout.tableWidth = tableWidth;
    },
    getStickyLeft(key) {
      // 说明是表头分组的上层元素，递归查找最下层的第一个后代元素
      if (this.flattenColumns.findIndex(x => x.dataIndex === key) < 0) {
        key = findFirstColumn(deepFindColumn(this.tableColumns, key)).dataIndex;
      }
      let l = 0;
      for (let i = 0; i < this.flattenColumns.length; i++) {
        const column = this.flattenColumns[i];
        if (column.dataIndex === key) break;
        l += column.width || column.renderWidth;
      }
      return l;
    },
    getStickyRight(key) {
      // 说明是表头分组的上层元素，递归查找最下层的最后一个后代元素
      if (this.flattenColumns.findIndex(x => x.dataIndex === key) < 0) {
        key = findLastColumn(deepFindColumn(this.tableColumns, key)).dataIndex;
      }
      let r = 0;
      for (let i = this.flattenColumns.length - 1; i >= 0; i--) {
        const column = this.flattenColumns[i];
        if (column.dataIndex === key) break;
        r += column.width || column.renderWidth;
      }
      return r;
    }
  }
};

export default columnsMixin;
