/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-23 16:10:23
 **/
import './style/index.scss';
import BaseDialog from './baseDialog.js';

BaseDialog.install = Vue => {
  Vue.component(BaseDialog.name, BaseDialog);
};

export default BaseDialog;
export { BaseDialog };
