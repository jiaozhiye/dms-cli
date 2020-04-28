/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-27 14:34:16
 */
const files = require.context('./service', true, /\.js$/);

let configMaps = {};

files.keys().forEach(key => {
  if (key !== './index.js') {
    configMaps = { ...configMaps, ...files(key).default };
    return configMaps;
  }
});

export default configMaps;
