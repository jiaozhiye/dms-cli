/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-02-25 20:21:14
 **/
import VirtualScroll from './VirtualScroll.vue';

export default {
  install(Vue) {
    Vue.component('VirtualScroll', VirtualScroll);
  }
};

export { VirtualScroll };
