/*
 * @Author: 焦质晔
 * @Date: 2020-05-19 15:58:23
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-13 20:06:13
 */
import config from '../config';
import Locale from '../locale/mixin';

import BaseDialog from '../../../BaseDialog';
import HighSearchSetting from './setting';

export default {
  name: 'HighSearch',
  mixins: [Locale],
  props: ['columns'],
  inject: ['$$table'],
  data() {
    return {
      visible: false
    };
  },
  methods: {
    clickHandle() {
      this.visible = true;
    },
    closeHandle(val) {
      this.visible = val;
    }
  },
  render() {
    const { visible } = this;
    const wrapProps = {
      props: {
        visible,
        title: this.t('table.highSearch.settingTitle'),
        showFullScreen: false,
        width: '1100px',
        destroyOnClose: true,
        containerStyle: { height: 'calc(100% - 52px)', paddingBottom: '52px' }
      },
      on: {
        'update:visible': val => (this.visible = val)
      }
    };
    const columns = this.columns.filter(x => !['__expandable__', '__selection__', 'index', 'pageIndex', config.operationColumn].includes(x.dataIndex));
    const cls = [`v-high-search--wrapper`, `size--${this.$$table.tableSize}`];
    return (
      <div class={cls}>
        <span class="search-button" title={this.t('table.highSearch.text')} onClick={this.clickHandle}>
          <i class="iconfont icon-funnelplot" />
        </span>
        <BaseDialog {...wrapProps}>
          <HighSearchSetting columns={columns} onClose={this.closeHandle} />
        </BaseDialog>
      </div>
    );
  }
};
