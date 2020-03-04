/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-04 11:42:28
 **/
import UploadFile from './UploadFile.vue';

UploadFile.install = Vue => {
  Vue.component(UploadFile.name, UploadFile);
};

export default UploadFile;
export { UploadFile };
