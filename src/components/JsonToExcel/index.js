/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-02-25 18:22:50
 **/
import JsonToExcel from './JsonToExcel.vue';

export default {
  install(Vue) {
    Vue.component('JsonToExcel', JsonToExcel);
  }
};

export { JsonToExcel };
