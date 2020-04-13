/*
 * @Author: 焦质晔
 * @Date: 2020-02-29 22:17:28
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-13 16:27:42
 */
import addEventListener from 'add-dom-event-listener';
import { addResizeListener, removeResizeListener } from '@/components/_utils/resize-event';
import _ from 'lodash';

export default {
  renderBorderLine() {
    return this.bordered && <div class="v-table--border-line" />;
  },
  renderResizableLine() {
    return this.resizable && <div ref="resizable-bar" class="v-table--resizable-bar" />;
  },
  createResizeState() {
    const { offsetWidth, offsetHeight } = this.$vTable;
    this.resizeState = Object.assign({}, { width: offsetWidth, height: offsetHeight });
  },
  updateElsHeight() {
    const tableOuterHeight = this.$vTable.offsetHeight;
    this.layout.headerHeight = this.showHeader ? this.$$tableHeader.$el.offsetHeight : 0;
    this.layout.footerHeight = this.showFooter ? this.$$tableFooter.$el.offsetHeight : 0;
    // body 可视区高度
    this.layout.viewportHeight = tableOuterHeight - this.layout.headerHeight - this.layout.footerHeight;
    this.layout.tableBodyHeight = this.$$tableBody.$el.querySelector('.v-table--body').offsetHeight;
    this.scrollY = this.scrollYLoad || this.layout.tableBodyHeight > this.layout.viewportHeight;
  },
  resizeListener() {
    const { width: oldWidth, height: oldHeight } = this.resizeState;
    // X 方向
    const width = this.$vTable.offsetWidth;
    const isXChange = oldWidth !== width;
    // Y 方向
    const height = this.$vTable.offsetHeight;
    const isYChange = this.shouldUpdateHeight && oldHeight !== height;
    const shouldUpdateLayout = isXChange || isYChange;
    if (!shouldUpdateLayout) return;
    this.resizeState = { width, height };
    this.doLayout();
    if (isYChange && this.scrollYLoad) {
      setTimeout(this.loadTableData);
    }
  },
  calcTableHeight(ev) {
    ev && ev.preventDefault();
    const disY = this.showPagination ? 50 : 10;
    this.autoHeight = window.innerHeight - this.$vTable.getBoundingClientRect().top - disY;
    this.doLayout();
  },
  bindEvents() {
    addResizeListener(this.$vTable, this.resizeListener);
    if (this.height === 'auto') {
      this.resizeEvent = addEventListener(window, 'resize', this.calcTableHeight);
      this.calcTableHeight();
    }
  },
  removeEvents() {
    removeResizeListener(this.$vTable, this.resizeListener);
    this.resizeEvent && this.resizeEvent.remove();
  },
  doLayout() {
    this.updateColumnsWidth();
    if (this.shouldUpdateHeight) {
      this.$nextTick(this.updateElsHeight);
    }
  }
};
