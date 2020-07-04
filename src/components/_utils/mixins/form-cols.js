/*
 * @Author: 焦质晔
 * @Date: 2020-06-01 13:23:53
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-06-08 12:52:06
 */
import { addResizeListener, removeResizeListener } from '../resize-event';

export default {
  data() {
    return {
      flexCols: 4
    };
  },
  computed: {
    $formEle() {
      return this.$refs.form.$el;
    }
  },
  destroyed() {
    this.removeResizeEvent();
  },
  methods: {
    resizeListener() {
      let c = Math.floor(this.$formEle.offsetWidth / 300);
      let cols = 24 % c === 0 ? c : c - 1;
      cols = cols < 2 ? 2 : cols;
      cols = cols > 6 ? 6 : cols;
      this.flexCols = typeof this.cols === 'undefined' ? cols : this.cols;
    },
    bindResizeEvent() {
      addResizeListener(this.$formEle, this.resizeListener);
    },
    removeResizeEvent() {
      removeResizeListener(this.$formEle, this.resizeListener);
    }
  }
};
