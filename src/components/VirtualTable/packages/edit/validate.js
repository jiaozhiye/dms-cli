/*
 * @Author: 焦质晔
 * @Date: 2020-03-05 10:27:24
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-06-20 10:36:41
 */
import { isEmpty } from '../utils';
import { isFunction } from 'lodash';

const validateMixin = {
  methods: {
    // 表格中的表单校验
    createFieldValidate(rules, val, rowKey, columnKey) {
      if (!Array.isArray(rules)) {
        return console.error('[Table]: 可编辑单元格的校验规则 `rules` 配置不正确');
      }
      if (!rules.length) return;
      this.store.removeFromRequired({ x: rowKey, y: columnKey });
      this.store.removeFromValidate({ x: rowKey, y: columnKey });
      rules.forEach(x => {
        if (x.required && isEmpty(val)) {
          this.store.addToRequired({ x: rowKey, y: columnKey, text: x.message });
        }
        if (isFunction(x.validator) && x.validator(val)) {
          this.store.addToValidate({ x: rowKey, y: columnKey, text: x.message });
        }
      });
    }
  }
};

export default validateMixin;
