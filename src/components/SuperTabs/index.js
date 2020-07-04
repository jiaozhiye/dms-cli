/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-23 16:36:52
 **/
import './style/index.scss';
import SuperTabs from './superTabs.js';

SuperTabs.install = Vue => {
  Vue.component(SuperTabs.name, SuperTabs);
};

export default SuperTabs;
export { SuperTabs };
