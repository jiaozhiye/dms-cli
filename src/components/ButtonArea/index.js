/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-23 16:18:58
 **/
import './style/index.scss';
import ButtonArea from './buttonArea.js';

ButtonArea.install = Vue => {
  Vue.component(ButtonArea.name, ButtonArea);
};

export default ButtonArea;
export { ButtonArea };
