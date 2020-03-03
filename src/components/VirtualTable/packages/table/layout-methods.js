/*
 * @Author: 焦质晔
 * @Date: 2020-02-29 22:17:28
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-03 19:55:17
 */
import { parseHeight } from '../utils';
import { addResizeListener, removeResizeListener } from '@/components/_utils/resize-event';
import _ from 'lodash';

export default {
  updateColumnsWidth() {
    const tableWidth = this.$vTable.clientWidth;
    const scrollYWidth = this.scrollY ? this.layout.gutterWidth : 0;
    let flexColumns = this.flatColumns.filter(column => typeof column.width !== 'number');
    let bodyMinWidth = 0;

    this.flatColumns.forEach(column => {
      if (typeof column.width === 'number' && column.renderWidth) {
        column.renderWidth = null;
      }
    });

    if (flexColumns.length > 0) {
      this.flatColumns.forEach(column => {
        bodyMinWidth += column.width || this.defaultColumnWidth;
      });

      // 没有横向滚动条
      if (bodyMinWidth <= tableWidth - scrollYWidth) {
        this.scrollX = false;

        const totalFlexWidth = tableWidth - scrollYWidth - bodyMinWidth;

        if (flexColumns.length === 1) {
          // flexColumns[0].renderWidth = this.defaultColumnWidth + totalFlexWidth;
        } else {
          const allColumnsWidth = flexColumns.reduce((prev, column) => prev + this.defaultColumnWidth, 0);
          const flexWidthPerPixel = totalFlexWidth / allColumnsWidth;
          let noneFirstWidth = 0;

          flexColumns.forEach((column, index) => {
            if (index === 0) return;
            const flexWidth = Math.floor(this.defaultColumnWidth * flexWidthPerPixel);
            noneFirstWidth += flexWidth;
            column.renderWidth = this.defaultColumnWidth + flexWidth;
          });

          // flexColumns[0].renderWidth = this.defaultColumnWidth + totalFlexWidth - noneFirstWidth;
        }
      } else {
        this.scrollX = true;

        flexColumns.forEach(column => {
          column.renderWidth = this.defaultColumnWidth;
        });
      }

      // 表格内容宽度
      this.layout.tableBodyWidth = Math.max(bodyMinWidth, tableWidth);
    } else {
      this.flatColumns.forEach(column => {
        column.renderWidth = column.width || this.defaultColumnWidth;
        bodyMinWidth += column.renderWidth;
      });
      this.scrollX = bodyMinWidth > tableWidth;

      // 表格内容宽度
      this.layout.tableBodyWidth = bodyMinWidth;
    }
  },
  updateElsHeight() {
    const { tableHeader, tableBody, tableFooter } = this.$refs;

    const tableOuterHeight = this.$vTable.clientHeight;
    this.layout.headerHeight = this.showHeader ? tableHeader.$el.clientHeight : 0;
    // this.layout.footerHeight = this.showFooter ? tableFooter.$el.clientHeight : 0;
    this.layout.footerHeight = this.showFooter ? this.rowHeight : 0;
    // body 可视区高度
    this.layout.viewportHeight = tableOuterHeight - this.layout.headerHeight - this.layout.footerHeight;
    this.layout.tableBodyHeight = tableBody.$refs.vTableBody.clientHeight;

    this.scrollY = this.layout.tableBodyHeight > this.layout.viewportHeight;
  },
  setTableHeight(val, prop = 'height') {
    val = parseHeight(val);
    // 没有设置 height/maxHeight 参数
    if (!val) return;
    this.$vTable.style[prop] = typeof val === 'number' ? `${val}px` : val;
    // 更新高度
    this.updateElsHeight();
  },
  setTableMaxHeight(val) {
    this.setTableHeight(val, 'max-height');
  },
  bindEvents() {
    addResizeListener(this.$vTable, this.resizeListener);
  },
  unbindEvents() {
    removeResizeListener(this.$vTable, this.resizeListener);
  },
  resizeListener() {
    const { width: oldWidth } = this.resizeState;
    let shouldUpdateLayout = false;
    const width = this.$vTable.offsetWidth;
    shouldUpdateLayout = oldWidth !== width;
    if (!shouldUpdateLayout) return;
    this.resizeState = { width };
    this.doLayout();
  },
  doLayout() {
    if (this.shouldUpdateHeight) {
      this.updateElsHeight();
    }
    this.updateColumnsWidth();
  }
};
