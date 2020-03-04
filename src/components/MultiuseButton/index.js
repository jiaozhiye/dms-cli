/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-04 11:38:44
 **/
import MultiuseButton from './MultiuseButton.vue';

MultiuseButton.install = Vue => {
  Vue.component(MultiuseButton.name, MultiuseButton);
};

export default MultiuseButton;
export { MultiuseButton };
