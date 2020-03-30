/*
 * @Author: 焦质晔
 * @Date: 2020-03-05 10:27:24
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-31 00:29:08
 */
const expandableMixin = {
  methods: {
    // 创建展开列
    createExpandableColumn(options) {
      if (!options) {
        return null;
      }
      return {
        dataIndex: '__expandable__',
        title: '',
        width: 50,
        fixed: 'left',
        type: 'expand'
      };
    },
    // 展开行，已展开的 keys
    createRowExpandedKeys() {
      const { expandable, tableFullData = [], getRowKey } = this;
      if (!expandable) {
        return [];
      }
      return expandable.defaultExpandAllRows ? tableFullData.map((row, index) => getRowKey(row, index)) : [];
    }
  }
};

export default expandableMixin;
