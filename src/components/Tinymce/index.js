/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-04 11:41:38
 **/
import Tinymce from './Tinymce';

Tinymce.install = Vue => {
  Vue.component(Tinymce.name, Tinymce);
};

export default Tinymce;
export { Tinymce };
