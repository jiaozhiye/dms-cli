/*
 * @Author: 焦质晔
 * @Date: 2020-02-29 22:17:28
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-21 21:38:30
 */
import { addResizeListener, removeResizeListener } from '@/components/_utils/resize-event';
import _ from 'lodash';

export default {
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
  bindEvents() {
    addResizeListener(this.$vTable, this.resizeListener);
  },
  removeEvents() {
    removeResizeListener(this.$vTable, this.resizeListener);
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
  doLayout() {
    this.updateColumnsWidth();
    if (this.shouldUpdateHeight) {
      this.$nextTick(this.updateElsHeight);
    }
  }
};
