/*
 * @Author: 焦质晔
 * @Date: 2020-03-09 13:18:43
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-09 18:09:46
 */
import Popover from '../popper';

export default {
  name: 'THeadFilter',
  inject: ['$$table'],
  data() {
    return {
      showPopper: false
    };
  },
  methods: {
    popperVisibleHandle({ showPopper }) {
      this.showPopper = showPopper;
    }
  },
  render() {
    const { showPopper } = this;
    const filterBtnCls = [
      `v-filter-btn`,
      {
        [`selected`]: showPopper
      }
    ];
    return (
      <span class="v-cell--filter" title="筛选" onClick={ev => ev.stopPropagation()}>
        <Popover
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
            <div class="v-popper--content">待开发...</div>
          </div>
        </Popover>
      </span>
    );
  }
};
