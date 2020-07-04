/*
 * @Author: 焦质晔
 * @Date: 2020-05-27 15:20:11
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-27 15:23:01
 */
const warning = (valid, message) => {
  if (process.env.NODE_ENV !== 'production' && !valid && console !== undefined) {
    console.error(`Warning: ${message}`);
  }
};

export default (valid, component, message = '') => {
  warning(valid, `[${component}]: ${message}`);
};
