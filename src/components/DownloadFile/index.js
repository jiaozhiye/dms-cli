/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-04 11:37:21
 **/
import DownloadFile from './DownloadFile.vue';

DownloadFile.install = Vue => {
  Vue.component(DownloadFile.name, DownloadFile);
};

export default DownloadFile;
export { DownloadFile };
