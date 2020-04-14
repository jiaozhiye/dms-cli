/*
 * @Author: 焦质晔
 * @Date: 2020-04-14 16:03:27
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-14 16:15:28
 */
export default {
  // 计算表格高度
  CALCULATE_HEIGHT() {
    this.$nextTick(() => {
      this.calcTableHeight();
    });
  }
};
