/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-23 16:30:44
 **/
import MultiuseButton from './multiuseButton.js';

MultiuseButton.install = Vue => {
  Vue.component(MultiuseButton.name, MultiuseButton);
};

export default MultiuseButton;
export { MultiuseButton };
