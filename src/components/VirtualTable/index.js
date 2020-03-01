/*
 * @Author: 焦质晔
 * @Date: 2020-02-28 21:54:13
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-01 17:48:43
 */
import './styles/index.scss';
import Table from './packages/table';

Table.install = Vue => {
  Vue.component('VirtualTable', Table);
};

export default Table;
export const VirtualTable = Table;
