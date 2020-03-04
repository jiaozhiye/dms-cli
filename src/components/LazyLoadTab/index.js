/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-04 11:38:23
 **/
import LazyLoadTab from './LazyLoadTab.vue';

LazyLoadTab.install = Vue => {
  Vue.component(LazyLoadTab.name, LazyLoadTab);
};

export default LazyLoadTab;
export { LazyLoadTab };
