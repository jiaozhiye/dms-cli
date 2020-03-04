/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-04 11:40:35
 **/
import SuperTabs from './SuperTabs.vue';

SuperTabs.install = Vue => {
  Vue.component(SuperTabs.name, SuperTabs);
};

export default SuperTabs;
export { SuperTabs };
