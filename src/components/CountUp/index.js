/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-23 16:19:54
 **/
import CountUp from './countUp.js';

CountUp.install = Vue => {
  Vue.component(CountUp.name, CountUp);
};

export default CountUp;
export { CountUp };
