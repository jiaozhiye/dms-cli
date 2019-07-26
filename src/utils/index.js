/**
 * @Author: 焦质晔
 * @Date: 2019/6/20
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 15:45:00
 */
// 等待
export const sleep = async timeLen => {
  return new Promise(resolve => {
    setTimeout(resolve, timeLen);
  });
};

// 判断表单控件的值是否为空
export const isFormEmpty = val => {
  return typeof val === 'undefined' || val.trim() === '' || val === null;
};
