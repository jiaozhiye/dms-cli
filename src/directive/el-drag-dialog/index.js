import drag from './drag';

drag.install = install;
export default {
  install(Vue) {
    Vue.directive('el-drag-dialog', drag);
  }
};
