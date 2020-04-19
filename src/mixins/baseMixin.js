/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-19 09:34:38
 */
import _ from 'lodash';

const isValueEqual = (val1 = '', val2 = '') => {
  val1 = !_.isNull(val1) ? val1 : '';
  val2 = !_.isNull(val2) ? val2 : '';
  if (Array.isArray(val1) && !Array.isArray(val2)) {
    return !val1.length;
  }
  return _.isEqual(val1, val2);
};

export const basic = {
  methods: {
    setState(state, callback) {
      const newState = typeof state === 'function' ? state(this.$data, this.$props) : state;
      Object.assign(this.$data, newState);
      this.$nextTick(() => {
        callback && callback();
      });
    },
    /**
     * 表单项数据比对方法
     * @param {Object} formData 表单数据
     * @param {Object} originData 原始数据
     * @returns {Boolean} 与原始数据一致，返回 true；否则，返回 false
     */
    formDataCompare(formData, originData = {}) {
      const keys = Object.keys(formData).filter(x => !x.includes('|'));
      // 假设数据一致
      let res = true;
      for (let i = 0; i < keys.length; i++) {
        if (!isValueEqual(formData[keys[i]], originData[keys[i]])) {
          res = false;
          break;
        }
      }
      return res;
    }
  }
};
