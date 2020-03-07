/*
 * @Author: 焦质晔
 * @Date: 2020-02-29 14:13:08
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-07 22:56:42
 */
import _ from 'lodash';

// 获取 columns 展平后的一维数组
export const columnsFlatMap = columns => {
  const result = [];
  columns.forEach(column => {
    if (column.children) {
      result.push.apply(result, columnsFlatMap(column.children));
    } else {
      result.push(column);
    }
  });
  return result;
};

// 创建列筛选后的列字段数组
export const createFilterColumns = columns => {
  return columns.filter(column => {
    if (column.children) {
      column.children = createFilterColumns(column.children);
    }
    return !column.hidden;
  });
};

// 深度遍历 columns
export const deepMapColumns = (columns, callback) => {
  return columns.map(column => {
    if (column.children) {
      column.children = deepMapColumns(column.children);
    }
    callback && callback(column);
    return column;
  });
};

// 深度查找 column
export const deepFindColumn = (columns, mark) => {
  let result = null;
  for (let i = 0; i < columns.length; i++) {
    if (columns[i].children) {
      result = deepFindColumn(columns[i].children, mark);
    }
    if (result) {
      return result;
    }
    if (columns[i].dataIndex === mark) {
      return columns[i];
    }
  }
  return result;
};

// 等待
export const sleep = async timeLen => {
  return new Promise(resolve => setTimeout(resolve, timeLen));
};

// 函数截流
export const throttle = (fn, delay) => {
  return function(...args) {
    let nowTime = +new Date();
    if (!fn.lastTime || nowTime - fn.lastTime > delay) {
      fn.apply(this, args);
      fn.lastTime = nowTime;
    }
  };
};

// 函数防抖
export const debounce = (fn, delay) => {
  return function(...args) {
    fn.timer && clearTimeout(fn.timer);
    fn.timer = setTimeout(() => fn.apply(this, args), delay);
  };
};

// 根据属性路径获取对象的值
export const getValueByPath = (object, prop) => {
  prop = prop || '';
  const paths = prop.split('.');
  let current = object;
  let result = null;
  for (let i = 0, j = paths.length; i < j; i++) {
    const path = paths[i];
    if (!current) break;

    if (i === j - 1) {
      result = current[path];
      break;
    }
    current = current[path];
  }
  return result;
};

// 获取滚动条宽度
let cached;

export const getScrollBarSize = () => {
  if (typeof cached === 'undefined') {
    const inner = document.createElement('div');
    inner.style.width = '100%';
    inner.style.height = '200px';

    const outer = document.createElement('div');
    const outerStyle = outer.style;

    outerStyle.position = 'absolute';
    outerStyle.top = '-9999px';
    outerStyle.zIndex = -1;
    outerStyle.pointerEvents = 'none';
    outerStyle.visibility = 'hidden';
    outerStyle.width = '200px';
    outerStyle.height = '150px';
    outerStyle.overflow = 'hidden';

    outer.appendChild(inner);
    document.body.appendChild(outer);

    const widthContained = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    let widthScroll = inner.offsetWidth;

    if (widthContained === widthScroll) {
      widthScroll = outer.clientWidth;
    }

    document.body.removeChild(outer);
    cached = widthContained - widthScroll;
  }

  return cached;
};

// 获取元素相对于 目标祖先元素 的位置
export const getOffsetPos = (elem, container) => {
  return getNodeOffset(elem, container, { left: 0, top: 0 });
};
function getNodeOffset(elem, container, rest) {
  if (elem) {
    const parentElem = elem.parentNode;
    rest.top += elem.offsetTop;
    rest.left += elem.offsetLeft;
    if (parentElem && parentElem !== document.documentElement && parentElem !== document.body) {
      rest.top -= parentElem.scrollTop;
      rest.left -= parentElem.scrollLeft;
    }
    if (container && (elem === container || elem.offsetParent === container) ? 0 : elem.offsetParent) {
      return getNodeOffset(elem.offsetParent, container, rest);
    }
  }
  return rest;
}

// 格式化 DOM 元素高度
export const parseHeight = height => {
  if (typeof height === 'number') {
    return height;
  }
  if (typeof height === 'string') {
    if (/^\d+(?:px)?$/.test(height)) {
      return parseInt(height, 10);
    }
    return height;
  }
  return null;
};

// 获取浏览器内核信息
export const browse = () => {
  let $body, isChrome, isEdge;
  let isMobile = false;
  let result = {
    isMobile: isMobile,
    isPC: false
  };
  isEdge = isBrowseType('Edge');
  isChrome = isBrowseType('Chrome');
  isMobile = /(Android|webOS|iPhone|iPad|iPod|SymbianOS|BlackBerry|Windows Phone)/.test(navigator.userAgent);
  $body = document.body || document.documentElement;
  ['webkit', 'khtml', 'moz', 'ms', 'o'].forEach(core => {
    result['-' + core] = !!$body[core + 'MatchesSelector'];
  });
  result = Object.assign({}, result, {
    edge: isEdge,
    firefox: isBrowseType('Firefox'),
    msie: !isEdge && result['-ms'],
    safari: !isChrome && !isEdge && isBrowseType('Safari'),
    isMobile: isMobile,
    isPC: !isMobile
  });
  return result;
};
function isBrowseType(type) {
  return navigator.userAgent.indexOf(type) > -1;
}

// 判断参数是否为空
export const isEmpty = val => {
  // null or undefined
  if (val == null) return true;

  if (typeof val === 'boolean') return false;

  if (typeof val === 'number') return !val;

  if (val instanceof Error) return val.message === '';

  switch (Object.prototype.toString.call(val)) {
    // String or Array
    case '[object String]':
    case '[object Array]':
      return !val.length;

    // Map or Set or File
    case '[object File]':
    case '[object Map]':
    case '[object Set]': {
      return !val.size;
    }
    // Plain Object
    case '[object Object]': {
      return !Object.keys(val).length;
    }
  }

  return false;
};

// 获取格式化后的表格数据
export const getCellValue = (record, dataIndex) => {
  const val = _.get(record, dataIndex, '');
  return _.isNull(val) ? '' : val;
};

// 数字格式化
export const formatNumber = (value = '') => {
  value += '';
  const list = value.split('.');
  const prefix = list[0].charAt(0) === '-' ? '-' : '';
  let num = prefix ? list[0].slice(1) : list[0];
  let result = '';
  while (num.length > 3) {
    result = `, ${num.slice(-3)}${result}`;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
};
