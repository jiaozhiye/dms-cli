/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-06-16 11:09:37
 */
import store from '@/store';
import { notifyAction } from '@/utils';

const deepMapCity = (data, deep = 3, step = 1) => {
  const res = [];
  for (let key in data) {
    const target = { value: data[key]['regionCode'], text: data[key]['regionName'] };
    if (data[key].children && Object.keys(data[key].children).length) {
      if (step < deep) {
        target.children = deepMapCity(data[key].children, deep, step + 1);
      }
    }
    res.push(target);
  }
  return res;
};

export const dictionary = {
  beforeCreate() {
    this.$dict = Object.keys(store.state.app.dict).length ? { ...store.state.app.dict } : JSON.parse(localStorage.getItem('dict')) || {};
    if (!Object.keys(this.$dict).length) {
      notifyAction('本地数据字典被清空，请刷新当前页面！', 'warning');
    }
  },
  methods: {
    /**
     * @description 创建数据字典列表，支持过滤
     * @param {string} code 数据字典的 code 码
     * @param {array} filter 需要过滤数据字典项的 code 值
     * @param {bool} showStoped 是否显示已停用的数据字典，默认 false
     * @returns {array}
     */
    createDictList(code, filter = [], showStoped = false) {
      let vals = Array.isArray(filter) ? filter : [filter];
      let res = [];
      if (this.$dict && Array.isArray(this.$dict[code])) {
        // 过滤已停用的数据字典项
        res = !showStoped ? this.$dict[code].filter(x => x.stoped !== '1') : this.$dict[code];
        res = res.map(x => ({ text: x.cnText, value: x.value }));
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
      if (this.$dict && Array.isArray(this.$dict[code])) {
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
      return deepMapCity(this.$dict.region, deep);
    }
  }
};
