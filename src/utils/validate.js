/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-04 07:30:49
 */
import { isFormEmpty } from './index';

// 注意：表单控件如果使用了自定义校验规则，
// rules 配置中不能加 message 属性，required 的非空校验也需要在自定义的校验方法中实现

/**
 * @description 手机号校验
 * @param {object} rule 表单校验的规则
 * @param {string} value 表单元素的值
 * @param {func} callback 注入的回调函数
 * @returns
 */
export const phone = (rule, value, callback) => {
  if (rule.required && isFormEmpty(value)) {
    return callback(new Error('手机号不能为空'));
  }
  let regExp = /^1[2-9]\d{9}$/;
  if (isFormEmpty(value) || regExp.test(value)) {
    return callback();
  }
  callback(new Error('手机号格式不正确'));
};
