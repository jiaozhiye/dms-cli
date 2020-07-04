/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-12 19:29:29
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
export const phoneValidate = (rule, value, callback) => {
  if (rule.required && isFormEmpty(value)) {
    return callback(new Error('手机号不能为空'));
  }
  let regExp = /^1[2-9]\d{9}$/;
  if (isFormEmpty(value) || regExp.test(value)) {
    return callback();
  }
  callback(new Error('手机号格式不正确'));
};

// 固定电话校验
export const telPhoneValidate = (rule, value, callback) => {
  if (rule.required && isFormEmpty(value)) {
    return callback(new Error('电话号不能为空'));
  }
  let regExp = /^0\d{2,3}-?\d{7,8}$/;
  if (isFormEmpty(value) || regExp.test(value)) {
    return callback();
  }
  callback(new Error('电话号格式不正确'));
};

// 邮政编码校验
export const postCodeValidate = (rule, value, callback) => {
  if (rule.required && isFormEmpty(value)) {
    return callback(new Error('邮编不能为空'));
  }
  let regExp = /^[0-9]{6}$/;
  if (isFormEmpty(value) || regExp.test(value)) {
    return callback();
  }
  callback(new Error('邮编格式不正确'));
};

// 传真校验
export const faxValidate = (rule, value, callback) => {
  if (rule.required && isFormEmpty(value)) {
    return callback(new Error('传真不能为空'));
  }
  let regExp = /^(\d{3,4}-)?\d{7,8}$/;
  if (isFormEmpty(value) || regExp.test(value)) {
    return callback();
  }
  callback(new Error('传真格式不正确'));
};

// 邮箱校验校验
export const emailValidate = (rule, value, callback) => {
  if (rule.required && isFormEmpty(value)) {
    return callback(new Error('邮编不能为空'));
  }
  let regExp = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  if (isFormEmpty(value) || regExp.test(value)) {
    return callback();
  }
  callback(new Error('邮编格式不正确'));
};

// 车牌号校验
export const licensePlateValidate = (rule, value, callback) => {
  if (rule.required && isFormEmpty(value)) {
    return callback(new Error('车牌号不能为空'));
  }
  let regExp = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;
  if (isFormEmpty(value) || regExp.test(value)) {
    return callback();
  }
  callback(new Error('车牌号格式不正确'));
};

// VIN 校验
export const vinValidate = (rule, value, callback) => {
  if (rule.required && isFormEmpty(value)) {
    return callback(new Error('底盘号不能为空'));
  }
  let regExp = /^[\d|a-zA-Z|-]{17}$/;
  if (isFormEmpty(value) || regExp.test(value)) {
    return callback();
  }
  callback(new Error('底盘号格式不正确'));
};

// 密码校验
export const pwdValidate = (rule, value, callback) => {
  if (rule.required && isFormEmpty(value)) {
    return callback(new Error('密码不能为空'));
  }
  let regExp = /^(?!\d+$)(?![a-zA-Z]+$)(?![^(a-zA-Z|\d|\u4E00-\u9FA5)]+$).{8,}$/;
  if (isFormEmpty(value) || regExp.test(value)) {
    return callback();
  }
  callback(new Error('长度至少8位;数字,字母,特殊字符至少包含两种!'));
};
