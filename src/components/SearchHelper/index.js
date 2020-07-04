/*
 * @Author: 焦质晔
 * @Date: 2020-05-12 13:07:13
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-12 13:10:15
 */
import SearchHelper from './searchHelper';

SearchHelper.install = Vue => {
  Vue.component(SearchHelper.name, SearchHelper);
};

export default SearchHelper;
export { SearchHelper };
