/*
 * @Author: 焦质晔
 * @Date: 2020-05-27 15:30:29
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-06-03 13:28:34
 */
import { addResizeListener, removeResizeListener } from '../_utils/resize-event';

export default {
  destroyed() {
    this.removeResizeEvent();
  },
  methods: {
    resizeListener() {
      this.chartRef && this.chartRef.resize();
    },
    bindResizeEvent() {
      addResizeListener(this.$chart, this.resizeListener);
    },
    removeResizeEvent() {
      removeResizeListener(this.$chart, this.resizeListener);
    }
  }
};
