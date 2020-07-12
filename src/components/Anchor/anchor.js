/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-06 18:35:43
 **/
import PropTypes from '../_utils/vue-types';
import { isIE, debounce } from '../_utils/tool';
import Size from '../_utils/mixins/size';
import PrefixCls from '../_utils/mixins/prefix-cls';

export default {
  name: 'Anchor',
  mixins: [Size, PrefixCls],
  props: {
    labelList: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string
      })
    ).isRequired,
    activeId: PropTypes.string,
    size: PropTypes.oneOf(['small', 'default', 'large']),
    labelWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def(80)
  },
  data() {
    this.posArr = [];
    this.state = 'ready'; // 状态变量
    return {
      activeKey: this.createActiveKey()
    };
  },
  computed: {
    $scroll() {
      return this.$refs.scroll;
    }
  },
  mounted() {
    this.setPositionArr();
    this.bindScrollEvent();
  },
  destroyed() {
    this.$scroll.removeEventListener('scroll', this.scrollEventHandle);
  },
  methods: {
    createActiveKey() {
      let key = this.activeId;
      if (!key && this.labelList.length) {
        key = this.labelList[0].id;
      }
      return key;
    },
    findCurIndex(t) {
      let top = Math.abs(t);
      let index = -1;
      for (let i = 0; i < this.posArr.length; i++) {
        let t1 = this.posArr[i];
        let t2 = this.posArr[i + 1] || 10000;
        if (top >= t1 && top < t2) {
          index = i;
        }
      }
      return index;
    },
    syncLabelKey(index) {
      this.activeKey = this.labelList[index].id;
    },
    clickHandle(e, key) {
      e.stopPropagation();
      this.state = 'stop';
      this.activeKey = key;
      if (isIE()) {
        this.$scroll.scrollTop = document.getElementById(key).offsetTop;
      } else {
        this.$scroll.scrollTo({ top: document.getElementById(key).offsetTop, behavior: 'smooth' });
        setTimeout(() => (this.state = 'ready'), 400);
      }
    },
    setPositionArr() {
      this.posArr = this.labelList.map(x => document.getElementById(x.id).offsetTop);
    },
    bindScrollEvent() {
      this.$scroll.addEventListener('scroll', this.scrollEventHandle, false);
    },
    scrollEventHandle(e) {
      debounce(this.moveHandle, 20)(e);
    },
    moveHandle(e) {
      if (this.state !== 'ready') return;
      let index = this.findCurIndex(e.target.scrollTop);
      if (index === -1) return;
      this.syncLabelKey(index);
    },
    createLabel() {
      if (!this.labelList.length) {
        return null;
      }
      const LabelItems = this.labelList.map(x => (
        <li key={x.id} title={x.title} href={`#/${x.id}`} class={{ selected: this.activeKey === x.id }} onClick={e => this.clickHandle(e, x.id)}>
          <span>{x.title}</span>
        </li>
      ));
      const labelWidth = typeof this.labelWidth === 'number' ? `${this.labelWidth}px` : this.labelWidth;
      return (
        <div key="label" class="labels" style={{ width: labelWidth }}>
          {LabelItems}
        </div>
      );
    },
    // 组件向外公开露的方法
    REFRESH() {
      this.setPositionArr();
    }
  },
  render() {
    const prefixCls = this.getPrefixCls('anchor--wrapper');
    const cls = {
      [prefixCls]: true,
      [`${prefixCls}-sm`]: this.currentSize === 'small',
      [`${prefixCls}-lg`]: this.currentSize === 'large'
    };
    return (
      <div class={cls}>
        {this.createLabel()}
        <div class="scroll-wrapper" ref="scroll">
          {this.$slots['default']}
        </div>
      </div>
    );
  }
};
