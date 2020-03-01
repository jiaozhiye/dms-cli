/*
 * @Author: 焦质晔
 * @Date: 2020-02-29 22:17:28
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-02 02:41:12
 */
import { parseHeight } from '../utils';

export default {
  updateColumnWidth() {
    const tableWidth = this.$vTable.clientWidth;
    const scrollYWidth = this.scrollY ? this.gutterWidth : 0;
    let flexColumns = this.flatColumns.filter(column => typeof column.width !== 'number');
    let bodyMinWidth = 0;

    if (flexColumns.length) {
      this.flatColumns.forEach(column => {
        bodyMinWidth += column.width || this.defaultColumnWidth;
      });
      // 没有横向滚动条
      if (bodyMinWidth <= tableWidth - scrollYWidth) {
        this.scrollX = false;

        const totalFlexWidth = tableWidth - scrollYWidth - bodyMinWidth;

        if (flexColumns.length === 1) {
          // flexColumns[0].width = this.defaultColumnWidth + totalFlexWidth;
        } else {
          const allColumnsWidth = flexColumns.reduce((prev, column) => prev + this.defaultColumnWidth, 0);
          const flexWidthPerPixel = totalFlexWidth / allColumnsWidth;
          let noneFirstWidth = 0;

          flexColumns.forEach((column, index) => {
            if (index === 0) return;
            const flexWidth = Math.floor(this.defaultColumnWidth * flexWidthPerPixel);
            noneFirstWidth += flexWidth;
            column.width = this.defaultColumnWidth + flexWidth;
          });

          // flexColumns[0].width = this.defaultColumnWidth + totalFlexWidth - noneFirstWidth;
        }
      } else {
        this.scrollX = true;

        flexColumns.forEach(column => {
          column.width = this.defaultColumnWidth;
        });
      }

      // 表格内容宽度
      this.layout.tableBodyWidth = Math.max(bodyMinWidth, tableWidth);
    } else {
      this.flatColumns.forEach(column => {
        bodyMinWidth += column.width || this.defaultColumnWidth;
      });
      this.scrollX = bodyMinWidth > tableWidth;

      // 表格内容宽度
      this.layout.tableBodyWidth = bodyMinWidth;
    }
  },
  updateScrollY() {
    const { tableBody } = this.$refs;
    if (!tableBody) return;
    const $tableBody = tableBody.$el.querySelector('.v-table--body');
    this.scrollY = this.scrollYLoad || $tableBody.clientHeight > this.layout.bodyWrapHeight;
  },
  updatedTableBodyHeight() {
    const { tableHeader, tableFooter } = this.$refs;
    // table 整体高度 -> header + body + footer
    const tableOuterHeight = this.$vTable.clientHeight;
    this.layout.headerHeight = this.showHeader ? tableHeader.$el.clientHeight : 0;
    // this.layout.footerHeight = this.showFooter ? tableFooter.$el.clientHeight : 0;
    this.layout.footerHeight = this.showFooter ? this.rowHeight : 0;
    // body 可视区高度
    this.layout.bodyWrapHeight = tableOuterHeight - this.layout.headerHeight - this.layout.footerHeight;
    this.updateScrollY();
  },
  setTableHeight(val, prop = 'height') {
    val = parseHeight(val);
    // 没有设置 height/maxHeight 参数
    if (!val) return;
    this.$vTable.style[prop] = typeof val === 'number' ? `${val}px` : val;
    this.updatedTableBodyHeight();
  },
  setTableMaxHeight(val) {
    this.setTableHeight(val, 'max-height');
  }
};
