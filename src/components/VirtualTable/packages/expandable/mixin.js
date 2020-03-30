/*
 * @Author: 焦质晔
 * @Date: 2020-03-05 10:27:24
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-30 16:36:07
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
    }
  }
};

export default expandableMixin;
