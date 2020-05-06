/*
 * @Author: 焦质晔
 * @Date: 2020-05-06 11:42:15
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-06 12:51:33
 */
const files = require.context('../modules', true, /\.route\.js$/);

let configRouters = [];

files.keys().forEach(key => {
  configRouters = configRouters.concat(files(key).default);
  return configRouters;
});

export default configRouters;
