/*
 * @Author: 焦质晔
 * @Date: 2020-03-29 14:18:07
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-24 09:21:54
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
    return (
      <span class="v-reload-data" title={this.t('table.refresh.text')} onClick={this.clickHandle}>
        <i class="iconfont icon-reload" />
      </span>
    );
  }
};
