/*
 * @Author: 焦质晔
 * @Date: 2020-02-29 22:17:28
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-05 10:30:30
 */
import { addResizeListener, removeResizeListener } from '@/components/_utils/resize-event';
import _ from 'lodash';

export default {
  updateElsHeight() {
    const { tableHeader, tableBody, tableFooter } = this.$refs;

    const tableOuterHeight = this.$vTable.clientHeight;
    this.layout.headerHeight = this.showHeader ? tableHeader.$el.clientHeight : 0;
    this.layout.footerHeight = this.showFooter ? tableFooter.$el.clientHeight : 0;
    // body 可视区高度
    this.layout.viewportHeight = tableOuterHeight - this.layout.headerHeight - this.layout.footerHeight;
    this.layout.tableBodyHeight = tableBody.$el.querySelector('.v-table--body').clientHeight;

    this.scrollY = this.scrollYLoad || this.layout.tableBodyHeight > this.layout.viewportHeight;
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
