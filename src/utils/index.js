/**
 * @Author: 焦质晔
 * @Date: 2019/6/20
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 15:45:00
 */
import { MessageBox, Notification, Message } from 'element-ui';

// 等待
export const sleep = async timeLen => {
  return new Promise(resolve => {
    setTimeout(resolve, timeLen);
  });
};

// 捕获基于 Promise 操作的异常
export const errorCapture = async promise => {
  try {
    const res = await promise;
    return [null, res];
  } catch (e) {
    return [e, null];
  }
};

// 需要确认的操作提示
export const confirmAction = async (msg = '确认进行此操作?', type = 'warning') => {
  return MessageBox.confirm(msg, '提示信息', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type
  });
};

// Notification 通知提示
export const notifyAction = (msg = '暂无...', type = 'success') => {
  Notification({
    title: '提示信息',
    message: msg,
    type
  });
};

// Message 消息提示
export const messageAction = (msg = '暂无...', type = 'info') => {
  Message({
    message: msg,
    showClose: true,
    type
  });
};

// 判断表单控件的值是否为空
export const isFormEmpty = val => {
  return typeof val === 'undefined' || val === '' || val === null;
};
