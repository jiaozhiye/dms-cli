/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-02 16:06:10
 */
import _ from 'lodash';
import { notifyAction } from '@/utils';

export const dictionary = {
  beforeCreate() {
    this.$dict = JSON.parse(localStorage.getItem('dict')) || {};
    if (!Object.keys(this.$dict).length) {
      notifyAction('本地数据字典被清空，请刷新当前页面！', 'warning');
    }
  },
  methods: {
    /**
     * @description 创建数据字典列表，支持过滤
     * @param {string} code 数据字典的 code 码
     * @param {array} vals 需要过滤数据字典项的值
     * @returns {array}
     */
    createDictList(code, vals = []) {
      vals = Array.isArray(vals) ? vals : [vals];
      let res = [];
      if (_.isObject(this.$dict) && Array.isArray(this.$dict[code])) {
        res = this.$dict[code].map(x => ({ text: x.cnText, value: x.value }));
        res = res.filter(x => !vals.includes(x.value));
      }
      return res;
    },
    /**
     * @description 数据字典的翻译
     * @param {string|number} val 数据的值
     * @param {string} code 数据字典的编码
     * @returns {string} 翻译后的文本
     */
    createDictText(val, code) {
      let res = '';
      if (!val) return res;
      if (_.isObject(this.$dict) && Array.isArray(this.$dict[code])) {
        const target = this.$dict[code].find(x => x.value == val);
        res = target ? target.cnText : val;
      }
      return res;
    },
    /**
     * @description 创建省市区数据列表
     * @param {number} deep 数据的级数，默认全部递归
     * @returns {array}
     */
    createDictRegion(deep) {
      // this.$dict.region -> 数据字典中省市区的递归数据
      return this.deepMapCity(this.$dict.region, deep);
    },
    deepMapCity(data, deep = 3, step = 1) {
      const res = [];
      for (let key in data) {
        const target = { value: data[key]['regionCode'], text: data[key]['regionName'] };
        if (_.isObject(data[key].children) && Object.keys(data[key].children).length) {
          if (step < deep) {
            target.children = this.deepMapCity(data[key].children, deep, step + 1);
          }
        }
        res.push(target);
      }
      return res;
    }
  }
};
