/*
 * @Author: 焦质晔
 * @Date: 2020-02-28 21:54:13
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-24 09:14:28
 */
import './styles/index.scss';
import locale from './packages/locale';
import Table from './packages/table';

Table.install = (Vue, opts = {}) => {
  locale.use(opts.locale);
  locale.i18n(opts.i18n);
  Vue.component(Table.name, Table);
};

export default Table;
export const VirtualTable = Table;
