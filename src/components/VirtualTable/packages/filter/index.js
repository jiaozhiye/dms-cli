/*
 * @Author: 焦质晔
 * @Date: 2020-03-09 13:18:43
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-11 01:14:53
 */
import Popper from '../popper';

import { isEmpty } from '../utils';

export default {
  name: 'THeadFilter',
  props: ['column'],
  inject: ['$$header'],
  data() {
    return {
      showPopper: false,
      filterParams: {}
    };
  },
  computed: {
    dataKey() {
      const { dataIndex, filter } = this.column;
      return Object.keys(this.filterParams)[0] || `${filter.type}|${dataIndex}`;
    },
    isActived() {
      return !isEmpty(this.$$header.thFilter[this.dataKey]);
    }
  },
  methods: {
    popperVisibleHandle({ showPopper }) {
      this.showPopper = showPopper;
    },
    doFinish() {
      const cloneFilter = { ...this.$$header.thFilter };
      if (isEmpty(this.filterParams[this.dataKey])) {
        this.filterParams = {};
        delete cloneFilter[this.dataKey];
      }
      this.$$header.thFilter = Object.assign({}, cloneFilter, this.filterParams);
      this.$refs[`vPopper`].doClose();
    },
    doReset() {
      if (!Object.keys(this.filterParams).length) return;
      this.filterParams = {};
      this.doFinish();
    },
    renderContent() {
      const { type } = this.column.filter;
      const renderFormItem = this[`${type}Handle`];
      if (!renderFormItem) {
        console.error('[Table]:表头筛选的类型 `type` 配置不正确');
        return null;
      }
      return (
        <div class="v-filter--wrap">
          {renderFormItem(this.column)}
          {this.renderFormButton()}
        </div>
      );
    },
    renderFormButton() {
      return (
        <div style="padding: 10px 0 6px">
          <el-button type="primary" size="mini" onClick={this.doFinish}>
            搜索
          </el-button>
          <el-button size="mini" onClick={this.doReset}>
            重置
          </el-button>
        </div>
      );
    },
    textHandle(column) {
      const {
        dataIndex,
        title,
        filter: { type }
      } = column;
      return (
        <div style="padding-top: 6px">
          <el-input
            v-model={this.filterParams[`${type}|${dataIndex}`]}
            placeholder={`搜索${title}`}
            style={{ width: '180px' }}
            nativeOnKeydown={ev => {
              if (ev.keyCode === 13) {
                this.doFinish();
              }
            }}
          />
        </div>
      );
    }
  },
  render() {
    const { showPopper, isActived } = this;
    const filterBtnCls = [
      `v-filter-btn`,
      {
        [`selected`]: showPopper,
        [`actived`]: isActived
      }
    ];
    return (
      <span class="v-cell--filter" title="筛选" onClick={ev => ev.stopPropagation()}>
        <Popper
          ref="vPopper"
          trigger="clickToToggle"
          root-class="v-popover--wrapper"
          transition="v-zoom-in-top"
          options={{ placement: 'bottom-end' }}
          visible-arrow={false}
          append-to-body={true}
          onShow={this.popperVisibleHandle}
          onHide={this.popperVisibleHandle}
        >
          <div class={filterBtnCls} slot="reference">
            <i class="v-icon--funnel" />
          </div>
          <div class="v-popper">
            <div class="v-popper--content">{this.renderContent()}</div>
          </div>
        </Popper>
      </span>
    );
  }
};
