/*
 * @Author: 焦质晔
 * @Date: 2020-07-12 16:26:19
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-12 17:01:48
 */
import localforage from 'localforage';
import config from '../config';
import Locale from '../locale/mixin';

import VTable from '../table';
import EmptyEle from '../empty/element';

export default {
  name: 'HighSearchSetting',
  mixins: [Locale],
  props: ['columns'],
  inject: ['$$table'],
  computed: {
    highSearchKey() {
      return this.$$table.uniqueKey ? `search_${this.$$table.uniqueKey}` : '';
    }
  },
  methods: {
    // 关闭
    cancelHandle() {
      this.$emit('close', false);
    }
  },
  render() {
    return (
      <div>
        <div style="height: 300px">asdsad</div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: 9,
            borderTop: '1px solid #d9d9d9',
            padding: '10px 15px',
            background: '#fff',
            textAlign: 'right'
          }}
        >
          <el-button onClick={() => this.cancelHandle()}>{this.t('table.highSearch.closeButton')}</el-button>
          <el-button type="primary">{this.t('table.highSearch.searchButton')}</el-button>
        </div>
      </div>
    );
  }
};
