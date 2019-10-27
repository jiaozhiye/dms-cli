/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 10:00:00
 */
import drag from './drag';

export default {
  install(Vue) {
    Vue.directive('el-drag-dialog', drag);
  }
};
