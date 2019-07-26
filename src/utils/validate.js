/**
 * @Author: 焦质晔
 * @Date: 2019/6/20
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 15:45:00
 */
import { isFormEmpty } from './index';

export const phone = (rule, value, callback) => {
  if (rule.required && isFormEmpty('手机号不能为空')) {
    return callback(new Error(message));
  }
  let regExp = /^1[2-9]\d{9}$/;
  if (isFormEmpty(value) || regExp.test(value)) {
    return callback();
  }
  callback(new Error('手机号格式不正确'));
};
