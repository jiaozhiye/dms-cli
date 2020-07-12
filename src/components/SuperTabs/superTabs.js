/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-06 18:36:44
 **/
import { isEqual } from 'lodash';
import PropTypes from '../_utils/vue-types';
import { filterEmpty } from '../_utils/props-util';
import Size from '../_utils/mixins/size';
import PrefixCls from '../_utils/mixins/prefix-cls';

export default {
  name: 'SuperTabs',
  mixins: [Size, PrefixCls],
  props: {
    initialValue: PropTypes.string.isRequired,
    tabBarGutter: PropTypes.number.def(0),
    size: PropTypes.oneOf(['small', 'default', 'large']),
    animated: PropTypes.bool.def(false),
    lazyLoad: PropTypes.bool.def(true),
    destroyOnClose: PropTypes.bool.def(false),
    containerStyle: PropTypes.object.def({})
  },
  data() {
    this.loadMarks = {};
    this.tabKeys = [];
    return {
      activeKey: this.initialValue, // 桥接线索
      tabLabels: []
    };
  },
  computed: {
    $navWrap() {
      return this.$refs['navWrap'];
    },
    $tabInkBar() {
      return this.$refs['tabInkBar'];
    },
    $tabContainer() {
      return this.$refs['tabContainer'];
    },
    // 当前选项卡的索引
    curIndex() {
      return this.tabKeys.findIndex(x => x === this.activeKey);
    }
  },
  watch: {
    initialValue(val) {
      this.activeKey = val;
      this.initial();
    },
    tabLabels(next, prev) {
      if (isEqual(next, prev)) return;
      this.initial();
    }
  },
  mounted() {
    this.initial();
  },
  methods: {
    initial() {
      this.createTabInkBar();
      this.createTabContentMove();
    },
    createTabInkBar() {
      if (this.curIndex < 0) return;
      const tabNavEl = this.$navWrap.querySelectorAll('.tabs-tab')[this.curIndex];
      this.$tabInkBar.style.width = `${tabNavEl.offsetWidth}px`;
      this.$tabInkBar.style.transform = `translate3d(${tabNavEl.offsetLeft}px, 0, 0)`;
    },
    createTabContentMove() {
      if (this.curIndex < 0) return;
      const tabPanes = this.$tabContainer.children;
      if (this.animated) {
        this.$tabContainer.style.marginLeft = `${-1 * this.curIndex * 100}%`;
      } else {
        for (let i = 0; i < tabPanes.length; i++) {
          tabPanes[i].style.display = 'none';
        }
        tabPanes[this.curIndex].style.display = 'block';
      }
    },
    tabNavClickHandle(ev, { key, disabled }) {
      if (!!disabled) return;
      // 同步 key 的值
      this.activeKey = key;
      this.createTabInkBar();
      this.createTabContentMove();
      // 触发事件
      this.$emit('change', key);
    },
    createTabKeys(arr) {
      this.tabKeys = arr.map(x => x.key);
      this.tabLabels = arr.map(x => x.label);
    },
    createTabsNav(arr) {
      return arr.map(x => {
        const isActive = x.key === this.activeKey;
        const cls = {
          [`tabs-tab`]: true,
          [`tab-${this.currentSize}`]: true,
          [`tab-active`]: isActive,
          [`no-events`]: !!x.disabled
        };
        const tabBarStyle = {
          marginLeft: `${this.tabBarGutter}px`,
          marginRight: `${this.tabBarGutter}px`
        };
        return (
          <div key={x.key} class={cls} style={tabBarStyle} onClick={ev => this.tabNavClickHandle(ev, x)}>
            {x.label}
          </div>
        );
      });
    },
    createTabsContent(arr) {
      return arr.map(x => {
        const isActive = x.key === this.activeKey;
        // let Component = <keep-alive>{x.children}</keep-alive>;
        let Component = x.children;
        if (!this.destroyOnClose) {
          if (this.lazyLoad) {
            if (isActive) {
              this.loadMarks[x.key] = true;
            } else if (!this.loadMarks[x.key]) {
              Component = null;
            }
          }
        } else {
          Component = isActive ? x.children : null;
        }
        const cls = {
          [`tabs-tabpane`]: true,
          [`tabs-tabpane-active`]: isActive
        };
        return (
          <div key={x.key} class={cls}>
            {Component}
          </div>
        );
      });
    },
    createTabMenus(vNodes) {
      return vNodes.map(x => ({
        key: x.key || x.data.attrs.label,
        label: x.data.attrs.label,
        disabled: x.data.attrs.disabled,
        children: x.children || []
      }));
    }
  },
  render() {
    const { containerStyle, $slots } = this;
    const prefixCls = this.getPrefixCls('super-tab--wrapper');
    const cls = {
      [prefixCls]: true,
      [`${prefixCls}-sm`]: this.currentSize === 'small',
      [`${prefixCls}-lg`]: this.currentSize === 'large'
    };
    const children = filterEmpty($slots.default).filter(x => x.tag === 'tab-panel' || x.tag === 'TabPanel');
    const menus = this.createTabMenus(children);
    // 创建选项卡 key 数组
    this.createTabKeys(menus);
    return (
      <div class={cls} style={{ ...containerStyle }}>
        <div class="tab-top-bar">
          <div class="tabs-nav-container">
            <div class="tabs-nav-animated">
              <div ref="navWrap">{this.createTabsNav(menus)}</div>
              <div class="tabs-ink-bar" ref="tabInkBar"></div>
            </div>
          </div>
          <div class="tabs-extra-content">{$slots['extraContent']}</div>
        </div>
        <div ref="tabContainer" class="tabs-content tabs-content-animated">
          {this.createTabsContent(menus)}
        </div>
      </div>
    );
  }
};
