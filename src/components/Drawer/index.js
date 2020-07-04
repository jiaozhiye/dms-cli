/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-23 16:23:25
 **/
import './style/index.scss';
import Drawer from './drawer.js';

Drawer.install = Vue => {
  Vue.component(Drawer.name, Drawer);
};

export default Drawer;
export { Drawer };
