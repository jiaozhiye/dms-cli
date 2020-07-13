/*
 * @Author: 焦质晔
 * @Date: 2020-07-11 10:51:46
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-13 15:53:50
 */
import sf from './lib/filter_string';
import vr from './lib/variables_replacement';
import { matchWhere } from './lib/operations';

const _query = (...rest) => {
  return matchWhere(...rest);
};

export const stringify = sf.stringify;

export const array_format = sf.array_format;

export const isBracketBalance = vr.isBracketBalance;

export const where = (array, query) => {
  let result = [];

  // Replace AND and OR to && and ||
  query = sf.replace_symbols(query);
  query = vr.replace_variables(query, 'array[i]');
  // console.log(`Conditionals`, query);

  for (let i = 0; i < array.length; i++) {
    if (eval(query)) {
      result.push(array[i]);
    }
  }

  return result;
};
