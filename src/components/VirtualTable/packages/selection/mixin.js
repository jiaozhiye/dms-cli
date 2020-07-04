/*
 * @Author: 焦质晔
 * @Date: 2020-03-05 10:27:24
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-06-17 18:55:38
 */
import config from '../config';

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
        title: type === 'radio' ? config.selectionText() : '',
        width: 50,
        fixed: 'left',
        type
      };
    },
    // 选择列已选中 keys
    createSelectionKeys() {
      const { rowSelection } = this;
      if (!rowSelection) {
        return [];
      }
      const { type, selectedRowKeys = [] } = rowSelection;
      return type === 'radio' ? selectedRowKeys.slice(0, 1) : selectedRowKeys;
    }
  }
};

export default selectionMixin;
