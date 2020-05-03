/*
 * @Author: 焦质晔
 * @Date: 2019-11-11 23:01:46
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-04 07:26:34
 */
import { MessageBox, Notification, Message } from 'element-ui';
import Cookies from 'js-cookie';
import config from '@/config';
import i18n from '@/lang';
import store from '@/store';

/**
 * @description 异步加载路由组件
 * @param {string} __name__ 页面组件的路径，从 pages 文件夹开始
 * @returns
 */
export const asyncLoadComponent = __name__ => () => import(`@/pages/${__name__}`);

/**
 * @description 延迟方法，异步函数
 * @param {number} delay 延迟的时间，单位 毫秒
 * @returns
 */
export const sleep = async delay => {
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * @description 捕获基于 Promise 操作的异常
 * @param {object} promise Promise 对象
 * @returns {array} 错误前置
 */
export const errorCapture = async promise => {
  try {
    const res = await promise;
    return [null, res];
  } catch (e) {
    return [e, null];
  }
};

/**
 * @description 函数防抖
 * @param {func} fn 目标函数
 * @param {number} delay 延迟的时间，单位 毫秒
 * @returns
 */
export const debounce = (fn, delay) => {
  return function(...args) {
    fn.timer && clearTimeout(fn.timer);
    fn.timer = setTimeout(() => fn.apply(this, args), delay);
  };
};

/**
 * @description 函数截流
 * @param {func} fn 目标函数
 * @param {number} delay 延迟的时间，单位 毫秒
 * @returns
 */
export const throttle = (fn, delay) => {
  return function(...args) {
    let nowTime = +new Date();
    if (!fn.lastTime || nowTime - fn.lastTime > delay) {
      fn.apply(this, args);
      fn.lastTime = nowTime;
    }
  };
};

/**
 * @description 需要确认的操作提示
 * @param {string} msg 提示的文本
 * @param {string} type 提示类型
 * @returns
 */
export const confirmAction = async (msg = i18n.t('information.confirm'), type = 'warning') => {
  return MessageBox.confirm(msg, i18n.t('information.title'), { confirmButtonText: i18n.t('button.confirm'), cancelButtonText: i18n.t('button.cancel'), type, dangerouslyUseHTMLString: true });
};

/**
 * @description Notification 通知提示
 * @param {string} msg 提示的文本
 * @param {string} type 提示类型
 * @param {number} delay 延迟的时间，单位 毫秒，如果值是 0，为手动关闭模式
 * @returns
 */
export const notifyAction = async (msg = '', type = 'success', delay = config.notifyDuration) => {
  if (store.state.app.isNotifyMark) return;
  store.dispatch('app/createNotifyState', true);
  Notification({ title: i18n.t('information.title'), message: msg, type, duration: delay, dangerouslyUseHTMLString: true });
  await sleep(config.notifyDuration);
  store.dispatch('app/createNotifyState', false);
};

/**
 * @description Message 消息提示
 * @param {string} msg 提示的文本
 * @param {string} type 提示类型
 * @returns
 */
export const messageAction = async (msg = '', type = 'info') => {
  if (store.state.app.isNotifyMark) return;
  store.dispatch('app/createNotifyState', true);
  Message({ message: msg, showClose: true, type, duration: config.notifyDuration });
  await sleep(config.notifyDuration);
  store.dispatch('app/createNotifyState', false);
};

/**
 * @description 清空所有 cookie
 * @returns
 */
export const clearAllCookie = () => {
  const keys = document.cookie.match(/[^ =;]+(?==)/g) || [];
  keys.forEach(x => {
    Cookies.remove(x);
  });
};

/**
 * @description 判断表单控件的值是否为空
 * @param {string} val 表单项的值
 * @returns {boolean} 表单是否为空
 */
export const isFormEmpty = val => {
  return typeof val === 'undefined' || val === '' || val === null;
};
