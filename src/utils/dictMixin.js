/**
 * @Author: 焦质晔
 * @Date: 2019/6/20
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 15:45:00
 */
import _ from 'lodash';

const getLocalDict = () => {
  return JSON.parse(localStorage.getItem('dict')) || {};
};

export const dictionary = {
  beforeCreate() {
    this.dict = getLocalDict();
    if (!Object.keys(this.dict).length) {
      return this.$notify({
        title: '提示信息',
        message: '本地数据字典被清空，请刷新当前页面',
        type: 'warning'
      });
    }
  },
  methods: {
    createDictList(code) {
      let res = [];
      if (_.isObject(this.dict) && Array.isArray(this.dict[code])) {
        res = this.dict[code].map(x => ({ text: x.code_cn_desc, value: x.code_id }));
      }
      return res;
    },
    createDictText(val, code) {
      let res = '';
      if (!val) return res;
      if (_.isObject(this.dict) && Array.isArray(this.dict[code])) {
        res = this.dict[code].find(x => x.code_id === val).code_cn_desc;
      }
      return res;
    }
  }
};
