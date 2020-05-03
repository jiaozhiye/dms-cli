/*
 * @Author: 焦质晔
 * @Date: 2020-02-28 21:54:13
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-03 19:59:49
 */
import './styles/index.scss';
import Table from './packages/table';
import locale from './packages/lang';

Table.install = (Vue, opts = {}) => {
  locale.use(opts.locale);
  locale.i18n(opts.i18n);
  Vue.component('VirtualTable', Table);
};

export default Table;
export const VirtualTable = Table;
