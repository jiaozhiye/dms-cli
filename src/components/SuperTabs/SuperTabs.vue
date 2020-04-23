<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-23 14:40:15
 **/
import _ from 'lodash';
import { filterEmpty } from '@/components/_utils/props-util';

export default {
  name: 'SuperTabs',
  props: {
    initialValue: {
      type: String,
      required: true
    },
    tabBarGutter: {
      type: Number,
      default: 0
    },
    size: {
      type: String,
      default: 'small'
    },
    animated: {
      type: Boolean,
      default: false
    },
    lazyLoad: {
      type: Boolean,
      default: true
    },
    destroyOnClose: {
      type: Boolean,
      default: false
    }
  },
  data() {
    this.tabNavNodes = [];
    this.tabInkBar = null;
    // tabs menu 数组
    this.menus = [];
    this.loadMarks = {};
    return {
      labels: [],
      currentValue: this.initialValue // 桥接线索
    };
  },
  computed: {
    // 当前选项卡的索引
    curIndex() {
      return this.labels.findIndex(x => x === this.currentValue);
    }
  },
  watch: {
    initialValue(val) {
      this.currentValue = val;
    },
    labels(nextProps, prevProps) {
      if (_.isEqual(nextProps, prevProps)) return;
      this.initial();
    }
  },
  mounted() {
    this.initial();
  },
  methods: {
    initial() {
      // 获取必要的 dom 节点
      this.tabNavNodes = Array.from(this.$refs['navWrap'].querySelectorAll('.tabs-tab'));
      this.tabInkBar = this.$refs['tabInkBar'];
      this.tabContainer = this.$refs['tabContainer'];
      this.tabPanes = [...this.tabContainer.children];
      // 初始化
      this.createTabInkBar();
      this.createTabContentMove();
    },
    createTabInkBar() {
      if (this.curIndex < 0) return;
      const iWid = this.tabNavNodes[this.curIndex].offsetWidth;
      const iLeft = this.tabNavNodes[this.curIndex].offsetLeft;
      this.tabInkBar.style.width = `${iWid}px`;
      this.tabInkBar.style.transform = `translate3d(${iLeft}px, 0, 0)`;
    },
    createTabContentMove() {
      if (this.curIndex < 0) return;
      if (this.animated) {
        this.tabContainer.style.marginLeft = `${-1 * this.curIndex * 100}%`;
      } else {
        this.tabPanes.forEach(x => {
          x.style.display = 'none';
        });
        this.tabPanes[this.curIndex].style.display = 'block';
      }
    },
    tabNavClickHandle(ev, { label, disabled }) {
      if (!!disabled) {
        return false;
      }
      ev.stopPropagation();
      // 同步 label 的值
      this.currentValue = label;
      // 执行 nav 和 tab 切换
      this.createTabInkBar();
      this.createTabContentMove();
      // 触发事件
      this.$emit('change', label);
    },
    createTabsNav(arr) {
      return arr.map(x => {
        const isActive = x.label === this.currentValue;
        const cls = {
          [`tabs-tab`]: true,
          [`tab-${this.size}`]: true,
          [`tab-active`]: isActive,
          [`no-events`]: !!x.disabled
        };
        const tabBarStyle = {
          marginLeft: `${this.tabBarGutter}px`,
          marginRight: `${this.tabBarGutter}px`
        };
        return (
          <div key={x.label} class={cls} style={tabBarStyle} onClick={ev => this.tabNavClickHandle(ev, x)}>
            {x.label}
          </div>
        );
      });
    },
    createTabsContent(arr) {
      return arr.map(x => {
        const isActive = x.label === this.currentValue;
        // let Component = <keep-alive>{x.children}</keep-alive>;
        let Component = x.children;
        if (!this.destroyOnClose) {
          if (this.lazyLoad) {
            if (isActive) {
              this.loadMarks[x.label] = true;
            } else if (!this.loadMarks[x.label]) {
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
          <div key={x.label} class={cls}>
            {Component}
          </div>
        );
      });
    },
    createTabMenus(vNodes) {
      return vNodes.map(x => ({
        label: x.data.attrs.label,
        disabled: x.data.attrs.disabled,
        children: x.children || []
      }));
    }
  },
  render() {
    const { $slots } = this;
    const children = filterEmpty($slots.default).filter(x => x.tag === 'tab-panel');
    // 创建 tabs 数据
    const menus = this.createTabMenus(children);
    this.labels = menus.map(x => x.label);
    return (
      <div class="v-super-tab--wrapper">
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
</script>

<style lang="scss" scoped>
.v-super-tab--wrapper {
  width: 100%;
  overflow: hidden;
  .tab-top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid $borderColor;
    margin-bottom: $moduleMargin;
    .tabs-nav-container {
      height: 100%;
      margin-bottom: -1px;
      .tabs-nav-animated {
        height: 100%;
        position: relative;
        .tabs-tab {
          display: inline-block;
          padding: 15px 15px;
          transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
          cursor: pointer;
          &.tab-active,
          &:hover {
            color: $primaryColor;
          }
          &.no-events,
          &.no-events:hover {
            color: $disabledColor;
            cursor: not-allowed;
          }
          &.tab-small {
            padding: 10px 12px;
          }
          &.tab-large {
            padding: 16px 16px;
          }
        }
        .tabs-ink-bar {
          position: absolute;
          left: 0;
          bottom: 0;
          height: 2px;
          z-index: 1;
          background-color: $primaryColor;
          transform-origin: 0 50%;
          transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), left 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
      }
    }
    .tabs-extra-content {
      margin-right: $moduleMargin;
    }
  }
  .tabs-content {
    width: 100%;
    .tabs-tabpane {
      flex-shrink: 0;
      width: 100%;
      box-sizing: border-box;
      height: 0;
      opacity: 0;
      transition: opacity 0.45s ease;
      &.tabs-tabpane-active {
        height: auto;
        opacity: 1;
      }
    }
  }
  .tabs-content-animated {
    display: flex;
    flex-direction: row;
    will-change: margin-left;
    transition: margin-left 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
}
</style>
