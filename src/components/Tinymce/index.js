/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-24 11:06:23
 **/
import './style/index.scss';
import Tinymce from './tinymce.js';

Tinymce.install = Vue => {
  Vue.component(Tinymce.name, Tinymce);
};

export default Tinymce;
export { Tinymce };
