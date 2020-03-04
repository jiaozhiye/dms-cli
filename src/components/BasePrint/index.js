/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-04 11:35:14
 **/
import BasePrint from './BasePrint';

BasePrint.install = Vue => {
  Vue.component(BasePrint.name, BasePrint);
};

export default BasePrint;
export { BasePrint };
