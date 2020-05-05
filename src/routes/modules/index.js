/*
 * @Author: 焦质晔
 * @Date: 2019-11-25 10:18:16
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-05 21:58:24
 */
const files = require.context('.', false, /\.js$/);

let configRouters = [];

files.keys().forEach(key => {
  if (key !== './index.js') {
    configRouters = configRouters.concat(files(key).default);
    return configRouters;
  }
});

export default configRouters;
