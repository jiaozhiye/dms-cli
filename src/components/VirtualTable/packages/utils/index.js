/*
 * @Author: 焦质晔
 * @Date: 2020-02-29 14:13:08
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-16 17:31:34
 */
import _ from 'lodash';

// 展平 columns
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

// 筛选 columns
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
      column.children.forEach(subColumn => {
        subColumn.parentDataIndex = column.dataIndex;
        if (column.fixed) {
          subColumn.fixed = column.fixed;
        } else {
          delete subColumn.fixed;
        }
      });
      column.children = deepMapColumns(column.children);
    }
    // 执行回调
    callback && callback(column);
    return column;
  });
};

// 所有 columns
export const getAllColumns = columns => {
  const result = [];
  columns.forEach(column => {
    if (column.children) {
      result.push(column);
      result.push.apply(result, getAllColumns(column.children));
    } else {
      result.push(column);
    }
  });
  return result;
};

// 深度查找 column by dataIndex
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

// 查找最后一级的第一个 column
export const findFirstColumn = column => {
  const childColumns = column.children;
  if (childColumns) {
    if (childColumns[0].children) {
      return findFirstColumn(childColumns[0]);
    }
    return childColumns[0];
  }
  return column;
};

// 查找最后一级的最后一个 column
export const findLastColumn = column => {
  const childColumns = column.children;
  if (childColumns) {
    if (childColumns[childColumns.length - 1].children) {
      return findLastColumn(childColumns[childColumns.length - 1]);
    }
    return childColumns[childColumns.length - 1];
  }
  return column;
};

// 根据条件过滤 columns
export const filterTableColumns = (columns, marks) => {
  return columns.filter(x => !marks.includes(x.dataIndex));
};

// 表头分组
export const convertToRows = originColumns => {
  let maxLevel = 1;
  const traverse = (column, parent) => {
    if (parent) {
      column.level = parent.level + 1;
      if (maxLevel < column.level) {
        maxLevel = column.level;
      }
    }

    if (column.children) {
      let colSpan = 0;
      column.children.forEach(subColumn => {
        if (column.fixed) {
          subColumn.fixed = column.fixed;
        } else {
          delete subColumn.fixed;
        }
        traverse(subColumn, column);
        colSpan += subColumn.colSpan;
      });
      column.colSpan = colSpan;
    } else {
      column.colSpan = 1;
    }
  };

  originColumns.forEach(column => {
    column.level = 1;
    traverse(column);
  });

  const rows = [];
  for (let i = 0; i < maxLevel; i++) {
    rows.push([]);
  }

  const allColumns = getAllColumns(originColumns);

  allColumns.forEach(column => {
    if (!column.children) {
      column.rowSpan = maxLevel - column.level + 1;
    } else {
      column.rowSpan = 1;
    }
    rows[column.level - 1].push(column);
  });

  return rows;
};

// 延迟方法
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

// 判断元素是否为目标元素的后代
export const contains = (root, target) => {
  let node = target;
  while (node) {
    if (node === root) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
};

// 获取元素相对于 目标祖先元素 的位置
export const getNodeOffset = (elem, container, rest = { left: 0, top: 0 }) => {
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
};

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
function isBrowseType(type) {
  return navigator.userAgent.indexOf(type) > -1;
}
export const browse = () => {
  const isWebkit = isBrowseType('AppleWebKit');
  const isEdge = isBrowseType('Edge');
  let result = {
    webkit: isWebkit && !isEdge, // 苹果、谷歌内核
    moz: isBrowseType('Gecko') && isBrowseType('KHTML') == -1, // 火狐内核
    edge: isBrowseType('Edge'), // Edge 内核
    msie: isBrowseType('Trident') // IE 内核
  };
  return result;
};

// 判断参数是否为空
export const isEmpty = val => {
  // null or undefined
  if (val == null) return true;
  if (typeof val === 'boolean') return false;
  if (typeof val === 'number') return false;
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

// 比对两个对象的差异
export const difference = (object, base) => {
  return _.transform(object, function(result, value, key) {
    if (!_.isEqual(value, base[key])) {
      result[key] = _.isObject(value) && _.isObject(base[key]) ? difference(value, base[key]) : value;
    }
  });
};

// 获取格式化后的数据
export const getCellValue = (record, dataIndex) => {
  const val = _.get(record, dataIndex, '');
  return _.isNull(val) ? '' : val;
};

// 设置单元格的数据
export const setCellValue = (record, dataIndex, val = '') => {
  _.set(record, dataIndex, val);
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

// 数值类型校验
export const validateNumber = val => {
  const regExp = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
  return (!Number.isNaN(val) && regExp.test(val)) || val === '' || val === '-';
};

// 文件下载/blob
export const downloadFile = (opts, content) => {
  const { filename, type, download } = opts;
  const name = `${filename}.${type}`;
  if (window.Blob) {
    const blob = new Blob([content], { type: `text/${type}` });
    if (!download) {
      return Promise.resolve({ type, content, blob });
    }
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, name);
    } else {
      let linkElem = document.createElement('a');
      linkElem.target = '_blank';
      linkElem.download = name;
      linkElem.href = URL.createObjectURL(blob);
      document.body.appendChild(linkElem);
      linkElem.click();
      document.body.removeChild(linkElem);
      linkElem = null;
    }
  }
};
