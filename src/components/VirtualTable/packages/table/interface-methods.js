/*
 * @Author: 焦质晔
 * @Date: 2020-04-14 16:03:27
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-20 14:33:15
 */
export default {
  // 计算表格高度
  CALCULATE_HEIGHT() {
    this.$nextTick(() => {
      this.calcTableHeight();
    });
  },
  // 刷新表格数据
  DO_REFRESH() {
    this.getTableData();
  },
  // 获取表格操作记录
  GET_LOG() {
    const { required, validate, updated } = this.$store.state;
    return {
      required: required.map(item => ({ rowKey: item.x, dataIndex: item.y, text: item.text })),
      validate: validate.map(item => ({ rowKey: item.x, dataIndex: item.y, text: item.text })),
      updated
    };
  }
};
