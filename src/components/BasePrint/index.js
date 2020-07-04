/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-23 16:15:53
 **/
import './style/index.scss';
import BasePrint from './basePrint.js';

BasePrint.install = Vue => {
  Vue.component(BasePrint.name, BasePrint);
};

export default BasePrint;
export { BasePrint };
