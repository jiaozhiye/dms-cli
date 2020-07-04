/*
 * @Author: 焦质晔
 * @Date: 2020-04-30 14:59:03
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-06-20 10:41:42
 */
import Vue from 'vue';
import { merge } from 'lodash';
import { hasOwn } from '../utils';
import defaultLang from './lang/zh';

const RE_NARGS = /(%|)\{([0-9a-zA-Z_]+)\}/g;

/**
 * template
 * @param {String} string
 * @param {Array} ...args
 * @returns {String}
 */
const format = (string, ...args) => {
  if (args.length === 1 && typeof args[0] === 'object') {
    args = args[0];
  }

  if (!args || !args.hasOwnProperty) {
    args = {};
  }

  return string.replace(RE_NARGS, (match, prefix, i, index) => {
    let result;

    if (string[index - 1] === '{' && string[index + match.length] === '}') {
      return i;
    } else {
      result = hasOwn(args, i) ? args[i] : null;
      if (result === null || result === undefined) {
        return '';
      }

      return result;
    }
  });
};

let lang = defaultLang;
let merged = false;

let i18nHandler = function() {
  const vuei18n = Object.getPrototypeOf(this || Vue).$t;
  if (typeof vuei18n === 'function' && !!Vue.locale) {
    if (!merged) {
      merged = true;
      Vue.locale(Vue.config.lang, merge(lang, Vue.locale(Vue.config.lang) || {}));
    }
    return vuei18n.apply(this, arguments);
  }
};

export const t = function(path, options) {
  let value = i18nHandler.apply(this, arguments);
  if (value !== null && value !== undefined) return value;

  const array = path.split('.');
  let current = lang;

  for (let i = 0, j = array.length; i < j; i++) {
    const property = array[i];
    value = current[property];
    if (i === j - 1) return format(value, options);
    if (!value) return '';
    current = value;
  }
  return '';
};

export const use = function(l) {
  lang = l || lang;
};

export const i18n = function(fn) {
  i18nHandler = fn || i18nHandler;
};

export default { use, t, i18n };
