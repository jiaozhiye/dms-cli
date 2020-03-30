/*
 * @Author: 焦质晔
 * @Date: 2020-03-30 11:34:10
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-30 17:29:35
 */
const noop = () => {};

const localStorageMixin = {
  methods: {
    // 获取本地存储 columns
    getLocalColumns() {
      if (!this.cacheColumnsKey) return;
      // 本地存储
      const result = localStorage.getItem(this.cacheColumnsKey);
      if (!result) return;
      let localColumns = null;
      try {
        localColumns = JSON.parse(result);
      } catch (e) {}
      if (!localColumns) return;
      return localColumns.map(x => ({ ...this.columns.find(k => k.dataIndex === x.dataIndex), ...x }));
    },
    // 本地存储 columns
    setLocalColumns(columns) {
      if (!this.cacheColumnsKey) return;
      const result = columns.map(x => {
        const target = {};
        if (typeof x.hidden !== 'undefined') {
          target.hidden = x.hidden;
        }
        if (typeof x.fixed !== 'undefined') {
          target.fixed = x.fixed;
        }
        if (typeof x.width !== 'undefined') {
          target.width = x.width;
        }
        if (typeof x.renderWidth !== 'undefined') {
          target.renderWidth = x.renderWidth;
        }
        return {
          dataIndex: x.dataIndex,
          ...target
        };
      });
      // 本地存储
      localStorage.setItem(this.cacheColumnsKey, JSON.stringify(result));
    },
    initLocalColumns() {
      const { columnsChange = noop } = this;
      const localColumns = this.getLocalColumns();
      if (!localColumns) return;
      columnsChange(localColumns);
    }
  },
  created() {
    this.initLocalColumns();
  }
};

export default localStorageMixin;
