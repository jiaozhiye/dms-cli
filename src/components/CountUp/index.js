/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-04 11:37:03
 **/
import CountUp from './CountUp.vue';

CountUp.install = Vue => {
  Vue.component(CountUp.name, CountUp);
};

export default CountUp;
export { CountUp };
