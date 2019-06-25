/**
 * @Author: 焦质晔
 * @Date: 2019/6/20
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 15:45:00
 */
import drag from './drag';

export default {
  install(Vue) {
    Vue.directive('el-drag-dialog', drag);
  }
};
