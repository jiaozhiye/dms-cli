/*
 * @Author: 焦质晔
 * @Date: 2020-03-29 14:18:07
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-09 10:32:43
 */
import Locale from '../locale/mixin';

export default {
  name: 'Reload',
  mixins: [Locale],
  inject: ['$$table'],
  methods: {
    clickHandle() {
      this.$$table.getTableData();
    }
  },
  render() {
    const cls = [`v-reload-data`, `size--${this.$$table.tableSize}`];
    return (
      <span class={cls} title={this.t('table.refresh.text')} onClick={this.clickHandle}>
        <i class="iconfont icon-reload" />
      </span>
    );
  }
};
