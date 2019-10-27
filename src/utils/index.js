/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 10:00:00
 */
import { MessageBox, Notification, Message } from 'element-ui';
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

// 判断表单控件的值是否为空
export const isFormEmpty = val => {
  return typeof val === 'undefined' || val === '' || val === null;
};
