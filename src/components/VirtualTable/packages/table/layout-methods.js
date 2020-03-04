/*
 * @Author: 焦质晔
 * @Date: 2020-02-29 22:17:28
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-04 15:37:20
 */
import { parseHeight } from '../utils';
import { addResizeListener, removeResizeListener } from '@/components/_utils/resize-event';
import _ from 'lodash';

export default {
  updateColumnsWidth() {
    // 表格实际宽度
    const tableWidth = this.$vTable.clientWidth;
    const scrollYWidth = this.scrollY ? this.layout.gutterWidth : 0;
    // 没有指定宽度的列
    let flexColumns = this.flatColumns.filter(column => typeof column.width !== 'number');
    // 表格最小宽度
    let bodyMinWidth = 0;

    this.flatColumns.forEach(column => {
      if (typeof column.width === 'number' && column.renderWidth) {
        column.renderWidth = null;
      }
    });

    if (flexColumns.length > 0) {
      // 获取表格的最小宽度
      this.flatColumns.forEach(column => {
        bodyMinWidth += column.width || this.defaultColumnWidth;
      });

      // 最小宽度小于容器宽度 -> 没有横向滚动条
      if (bodyMinWidth <= tableWidth - scrollYWidth) {
        this.scrollX = false;

        // 富余的宽度
        const totalFlexWidth = tableWidth - scrollYWidth - bodyMinWidth;

        if (flexColumns.length === 1) {
          // flexColumns[0].renderWidth = this.defaultColumnWidth + totalFlexWidth;
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

          // flexColumns[0].renderWidth = this.defaultColumnWidth + totalFlexWidth - noneFirstWidth;
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
    this.layout.footerHeight = this.showFooter ? tableFooter.$el.clientHeight : 0;
    // body 可视区高度
    this.layout.viewportHeight = tableOuterHeight - this.layout.headerHeight - this.layout.footerHeight;
    this.layout.tableBodyHeight = tableBody.$el.querySelector('.v-table--body').clientHeight;

    this.scrollY = this.layout.tableBodyHeight > this.layout.viewportHeight;
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
    this.updateColumnsWidth();
    if (this.shouldUpdateHeight) {
      this.$nextTick(this.updateElsHeight);
    }
  }
};
