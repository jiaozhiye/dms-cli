/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-04 11:41:50
 **/
import TopFilter from './TopFilter.vue';

TopFilter.install = Vue => {
  Vue.component(TopFilter.name, TopFilter);
};

export default TopFilter;
export { TopFilter };
