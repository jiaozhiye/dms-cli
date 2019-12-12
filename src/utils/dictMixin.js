/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-12-12 18:29:30
 */
import _ from 'lodash';
import { notifyAction } from '@/utils';

const getLocalDict = () => {
  return JSON.parse(localStorage.getItem('dict')) || {};
};

export const dictionary = {
  beforeCreate() {
    this.dict = getLocalDict();
    if (!Object.keys(this.dict).length) {
      notifyAction('本地数据字典被清空，请刷新当前页面!', 'warning');
    }
  },
  methods: {
    // code -> 数据字典的 code 码
    // vals -> 需要过滤数据字典项的值
    createDictList(code, vals = []) {
      vals = Array.isArray(vals) ? vals : [vals];
      let res = [];
      if (_.isObject(this.dict) && Array.isArray(this.dict[code])) {
        res = this.dict[code].map(x => ({ text: x.codeCnDesc, value: x.codeId }));
        res = res.filter(x => !vals.includes(x.value));
      }
      return res;
    },
    // val -> 数据的值    code -> 数据字典的 code 码
    createDictText(val, code) {
      let res = '';
      if (!val) return res;
      if (_.isObject(this.dict) && Array.isArray(this.dict[code])) {
        const target = this.dict[code].find(x => x.codeId == val);
        res = target ? target.codeCnDesc : val;
      }
      return res;
    },
    // deep -> 数据的级数，默认全部递归
    createDictRegion(deep) {
      return this.deepMapCity(this.region, deep);
    },
    // 递归构建省市区数据
    deepMapCity(data, deep = 3, step = 1) {
      const res = [];
      for (let key in data) {
        const target = { value: data[key]['regionCode'], text: data[key]['regionName'] };
        if (_.isObject(data[key].children) && Object.keys(data[key].children).length) {
          if (step < deep) {
            target.children = this.deepMapCity(data[key].children, deep, ++step);
          }
        }
        res.push(target);
      }
      return res;
    }
  }
};
