/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-25 14:05:53
 **/
import UploadFile from './uploadFile.js';

UploadFile.install = Vue => {
  Vue.component(UploadFile.name, UploadFile);
};

export default UploadFile;
export { UploadFile };
