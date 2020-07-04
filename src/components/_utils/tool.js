/*
 * @Author: 焦质晔
 * @Date: 2020-05-23 10:58:27
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-03 10:39:02
 */
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
 * @description 获取浏览器窗口尺寸
 * @returns 包含 width / height 属性的对象
 */
export const getWindowSize = () => {
  return {
    width: window.innerWidth || document.body.clientWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight
  };
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
 * @description js 事件绑定
 * @param {HTMLNode} el 目标节点
 * @param {string} evType 事件类型
 * @param {func} handler 事件处理函数
 * @returns
 */
export const on = (el, evType, handler) => {
  if (el && evType && handler) {
    document.addEventListener ? el.addEventListener(evType, handler, false) : el.attachEvent('on' + evType, handler);
  }
};

/**
 * @description js 事件解绑
 * @param {HTMLNode} el 目标节点
 * @param {string} evType 事件类型
 * @param {func} handler 事件处理函数
 * @returns
 */
export const off = (el, evType, handler) => {
  if (el && evType) {
    document.removeEventListener ? el.removeEventListener(evType, handler, false) : el.detachEvent('on' + evType, handler);
  }
};
