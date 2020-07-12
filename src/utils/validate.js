/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-12 17:26:34
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

// 身份证校验
export const IDNumber = (rule, value, callback) => {
  if (rule.required && isFormEmpty(value)) {
    return callback(new Error('身份证号不能为空'));
  }
  const city = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江 ',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北 ',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外 '
  };
  const regExp = /^\d{15}$/ || !/^\d{6}(18|19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i;
  const checkLastNumber = val => {
    val = val.split('');
    // ∑(ai×Wi)(mod 11)
    // 加权因子
    let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    // 校验位
    let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    let ai = 0;
    let wi = 0;
    for (let i = 0; i < 17; i++) {
      ai = val[i];
      wi = factor[i];
      sum += ai * wi;
    }
    // let last = parity[sum % 11]
    if (String(parity[sum % 11]) !== val[17]) {
      return false;
    }
    return true;
  };
  if (isFormEmpty(value) || (city[value.substr(0, 2)] && regExp.test(value))) {
    // 18位身份证需要验证最后一位校验位
    if (value.length === 18 && checkLastNumber(value)) {
      return callback();
    }
  }
  callback(new Error('请输入正确的证件号'));
};
