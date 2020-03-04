/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-04 11:34:59
 **/
import BaseDialog from './BaseDialog.vue';

BaseDialog.install = Vue => {
  Vue.component(BaseDialog.name, BaseDialog);
};

export default BaseDialog;
export { BaseDialog };
