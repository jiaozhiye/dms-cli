/*
 * @Author: 焦质晔
 * @Date: 2020-03-05 10:27:24
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-22 15:47:00
 */
const selectionMixin = {
  methods: {
    // 创建选择列
    createSelectionColumn(options) {
      if (!options) {
        return null;
      }
      const { type } = options;
      return {
        dataIndex: '__selection__',
        title: type === 'radio' ? '#' : '',
        width: 50,
        fixed: 'left',
        type
      };
    },
    // 初始化选择列 keys
    initialSelectionKeys(mark) {
      if (!this.rowSelection) {
        return [];
      }
      const result = this.rowSelection[mark] || [];
      return this.rowSelection.type === 'radio' ? result.slice(0, 1) : result;
    }
  }
};

export default selectionMixin;
