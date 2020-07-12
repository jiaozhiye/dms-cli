/*
 * @Author: 焦质晔
 * @Date: 2020-07-11 13:39:54
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-12 14:17:34
 */
// 模糊搜索中需要转义的特殊字符
const SPAN_CHAR_REG = /(\^|\.|\[|\$|\(|\)|\||\*|\+|\?|\{|\\)/g;
// 基础数据类型
const PRIMITIVE_VALUES = ['string', 'number', 'boolean', 'symbol'];

const escapeKeyword = keyword => (keyword || '').toString().replace(SPAN_CHAR_REG, '\\$1');
const isPrimitive = value => PRIMITIVE_VALUES.includes(typeof value);

export const matchWhere = (value, expression, condition) => {
  let res = true;
  switch (expression) {
    case 'like':
      let keyword = new RegExp(escapeKeyword(condition), 'i');
      res = !!(value || '').toString().match(keyword);
      break;
    case 'in':
      if (isPrimitive(condition)) {
        condition = [condition];
      }
      if (Array.isArray(condition)) {
        res = condition.every(x => value.includes(x));
      } else {
        res = false;
      }
      break;
    case 'nin':
      if (isPrimitive(condition)) {
        condition = [condition];
      }
      if (Array.isArray(condition)) {
        res = condition.every(x => value.includes(x)) === false;
      }
      break;
    default:
      res = value === condition;
  }
  return res;
};
