/*
 * @Author: 焦质晔
 * @Date: 2020-02-29 22:17:28
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-23 09:24:13
 */
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
    const { tableHeader, tableBody, tableFooter } = this.$refs;

    const tableOuterHeight = this.$vTable.offsetHeight;
    this.layout.headerHeight = this.showHeader ? tableHeader.$el.offsetHeight : 0;
    this.layout.footerHeight = this.showFooter ? tableFooter.$el.offsetHeight : 0;
    // body 可视区高度
    this.layout.viewportHeight = tableOuterHeight - this.layout.headerHeight - this.layout.footerHeight;
    this.layout.tableBodyHeight = tableBody.$el.querySelector('.v-table--body').offsetHeight;

    this.scrollY = this.scrollYLoad || this.layout.tableBodyHeight > this.layout.viewportHeight;
  },
  resizeListener() {
    const { width: oldWidth, height: oldHeight } = this.resizeState;
    let shouldUpdateLayout = false;

    // X 方向
    const width = this.$vTable.offsetWidth;
    shouldUpdateLayout = oldWidth !== width;

    // Y 方向
    const height = this.$vTable.offsetHeight;
    if (this.shouldUpdateHeight && oldHeight !== height) {
      shouldUpdateLayout = !0;
    }

    if (!shouldUpdateLayout) return;
    this.resizeState = { width, height };
    // 重新渲染布局
    this.doLayout();
  },
  bindEvents() {
    addResizeListener(this.$vTable, this.resizeListener);
  },
  removeEvents() {
    removeResizeListener(this.$vTable, this.resizeListener);
  },
  doLayout() {
    this.updateColumnsWidth();
    if (this.shouldUpdateHeight) {
      this.$nextTick(this.updateElsHeight);
    }
  }
};
