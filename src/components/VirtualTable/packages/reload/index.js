/*
 * @Author: 焦质晔
 * @Date: 2020-03-29 14:18:07
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-03 16:35:56
 */
import i18n from '../lang';

export default {
  name: 'Reload',
  inject: ['$$table'],
  methods: {
    clickHandle() {
      this.$$table.getTableData();
    }
  },
  render() {
    return (
      <span class="v-reload-data" title={i18n.t('refresh.text')} onClick={this.clickHandle}>
        <i class="iconfont icon-reload" />
      </span>
    );
  }
};
