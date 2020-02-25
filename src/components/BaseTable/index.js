/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-02-25 18:20:55
 **/
import FilterTable from './filterTable.vue';

export default {
  install(Vue) {
    Vue.component('FilterTable', FilterTable);
  }
};

export { FilterTable };
