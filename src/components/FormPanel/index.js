/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-04 11:37:54
 **/
import FormPanel from './FormPanel.vue';

FormPanel.install = Vue => {
  Vue.component(FormPanel.name, FormPanel);
};

export default FormPanel;
export { FormPanel };
