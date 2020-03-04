/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-04 11:38:09
 **/
import JsonToExcel from './JsonToExcel.vue';

JsonToExcel.install = Vue => {
  Vue.component(JsonToExcel.name, JsonToExcel);
};

export default JsonToExcel;
export { JsonToExcel };
