/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-06 12:10:37
 **/
import './packages/index.less';
import Spin from './packages';

Spin.install = Vue => {
  Vue.component(Spin.name, Spin);
};

export default Spin;
export { Spin };
