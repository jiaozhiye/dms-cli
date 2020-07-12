/*
 * @Author: 焦质晔
 * @Date: 2020-03-30 11:34:10
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-07 19:59:29
 */
import { xor, isUndefined } from 'lodash';

const noop = () => {};

const localStorageMixin = {
  methods: {
    // 获取本地存储 columns
    getLocalColumns() {
      if (!this.uniqueKey) return;
      // 本地存储
      const result = localStorage.getItem(this.uniqueKey);
      if (!result) return;
      let localColumns = [];
      try {
        localColumns = JSON.parse(result);
      } catch (e) {}
      const diffs = xor(
        localColumns.map(x => x.dataIndex),
        this.columns.map(x => x.dataIndex)
      );
      if (diffs.length > 0) return;
      return localColumns.map(x => {
        let target = this.columns.find(k => k.dataIndex === x.dataIndex);
        if (isUndefined(x.fixed)) {
          delete target.fixed;
        }
        return { ...target, ...x };
      });
    },
    // 本地存储 columns
    setLocalColumns(columns) {
      if (!this.uniqueKey) return;
      const result = columns.map(x => {
        const target = {};
        if (!isUndefined(x.hidden)) {
          target.hidden = x.hidden;
        }
        if (!isUndefined(x.fixed)) {
          target.fixed = x.fixed;
        }
        if (!isUndefined(x.width)) {
          target.width = x.width;
        }
        if (!isUndefined(x.renderWidth)) {
          target.renderWidth = x.renderWidth;
        }
        return {
          dataIndex: x.dataIndex,
          ...target
        };
      });
      // 本地存储
      localStorage.setItem(this.uniqueKey, JSON.stringify(result));
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
