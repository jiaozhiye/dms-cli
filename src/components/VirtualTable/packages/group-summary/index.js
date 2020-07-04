/*
 * @Author: 焦质晔
 * @Date: 2020-05-19 15:58:23
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-06-28 09:26:03
 */
import localforage from 'localforage';
import config from '../config';
import Locale from '../locale/mixin';

import BaseDialog from '../../../BaseDialog';
import GroupSummarySetting from './setting';

export default {
  name: 'GroupSummary',
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
        title: this.t('table.groupSummary.settingTitle'),
        showFullScreen: false,
        width: '1000px',
        destroyOnClose: true,
        containerStyle: { height: 'calc(100% - 52px)', paddingBottom: '52px' }
      },
      on: {
        'update:visible': val => (this.visible = val)
      }
    };
    const columns = this.columns.filter(x => !['__expandable__', '__selection__', 'index', config.operationColumn].includes(x.dataIndex));
    return (
      <div class="v-group-summary--wrapper">
        <span class="summary-button" onClick={this.clickHandle}>
          <i class="iconfont icon-linechart" /> {this.t('table.groupSummary.text')}
        </span>
        <BaseDialog {...wrapProps}>
          <GroupSummarySetting columns={columns} onClose={this.closeHandle} />
        </BaseDialog>
      </div>
    );
  }
};
