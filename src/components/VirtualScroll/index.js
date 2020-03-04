/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-04 11:42:44
 **/
import VirtualScroll from './VirtualScroll.vue';

VirtualScroll.install = Vue => {
  Vue.component(VirtualScroll.name, VirtualScroll);
};

export default VirtualScroll;
export { VirtualScroll };
