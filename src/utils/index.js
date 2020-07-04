/*
 * @Author: 焦质晔
 * @Date: 2019-11-11 23:01:46
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-24 10:45:40
 */
import { MessageBox, Notification, Message } from 'element-ui';
import moment from 'moment';
import config from '@/config';
import i18n from '@/lang';
import store from '@/store';

/**
 * @description 判断浏览器是否 IE11
 * @param
 * @returns {boolean}
 */
export const isIE = () => {
  return !!window.ActiveXObject || 'ActiveXObject' in window;
};

/**
 * @description 判断对象属性是否为自身属性
 * @param {object} 目标对象
 * @param {string} 属性名
 * @returns {boolean}
 */
export const hasOwn = (obj, key) => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

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
 * @description 字符串转 moment 对象
 * @param {string|array} value 入参
 * @param {string} valueFormat 日期类型
 * @returns moment 对象
 */
export const stringToMoment = (value, valueFormat) => {
  if (Array.isArray(value)) {
    return value.map(val => (typeof val === 'string' && val ? moment(val, valueFormat) : val || null));
  } else {
    return typeof value === 'string' && value ? moment(value, valueFormat) : value || null;
  }
};

/**
 * @description moment 对象转成日期格式字符串
 * @param {string|array} value 入参
 * @param {string} valueFormat 日期类型
 * @returns 转换后的日期格式字符串
 */
export const momentToString = (value, valueFormat) => {
  if (Array.isArray(value)) {
    return value.map(val => (moment.isMoment(val) ? val.format(valueFormat) : val));
  } else {
    return moment.isMoment(value) ? value.format(valueFormat) : value;
  }
};

/**
 * @description 判断表单控件的值是否为空
 * @param {string} val 表单项的值
 * @returns {boolean} 表单是否为空
 */
export const isFormEmpty = val => {
  return typeof val === 'undefined' || val === '' || val === null;
};

/**
 * @description 生成 uuid
 * @param {string} key uuid 的前缀标识
 * @returns {boolean} 生成的 uuid 字符串
 */
export const createUidKey = (key = '') => {
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    let r = (Math.random() * 16) | 0;
    let v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
  return key + uuid;
};
