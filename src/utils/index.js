/*
 * @Author: 焦质晔
 * @Date: 2019-11-11 23:01:46
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-12-21 22:08:04
 */
import { MessageBox, Notification, Message } from 'element-ui';
import Cookies from 'js-cookie';
import config from '@/config';
import store from '@/store';

// 等待
export const sleep = async timeLen => {
  return new Promise(resolve => setTimeout(resolve, timeLen));
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
  return MessageBox.confirm(msg, '提示信息', { confirmButtonText: '确定', cancelButtonText: '取消', type });
};

// Notification 通知提示
export const notifyAction = async (msg = '暂无...', type = 'success', title = '提示信息') => {
  if (store.state.app.isNotifyMark) return;
  store.dispatch('app/createNotifyState', true);
  Notification({ title, message: msg, type, duration: config.notifyDuration });
  await sleep(config.notifyDuration);
  store.dispatch('app/createNotifyState', false);
};

// Message 消息提示
export const messageAction = async (msg = '暂无...', type = 'info') => {
  if (store.state.app.isNotifyMark) return;
  store.dispatch('app/createNotifyState', true);
  Message({ message: msg, showClose: true, type, duration: config.notifyDuration });
  await sleep(config.notifyDuration);
  store.dispatch('app/createNotifyState', false);
};

// 清空所有 cookie
export const clearAllCookie = () => {
  const keys = document.cookie.match(/[^ =;]+(?==)/g) || [];
  keys.forEach(x => {
    Cookies.remove(x);
  });
};

// 判断表单控件的值是否为空
export const isFormEmpty = val => {
  return typeof val === 'undefined' || val === '' || val === null;
};
