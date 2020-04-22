/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-22 19:18:46
 **/
import Drawer from './Drawer.vue';

Drawer.install = Vue => {
  Vue.component(Drawer.name, Drawer);
};

export default Drawer;
export { Drawer };
