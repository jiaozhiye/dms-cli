<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-05-06 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-05-07 11:00:00
 **/
export default {
  name: 'SuperTabs',
  props: {
    initialValue: {
      type: String,
      required: true
    },
    tabMenus: {
      type: Array,
      required: true,
      default: () => []
    },
    destroyOnClose: {
      type: Boolean,
      default: false
    }
  },
  data() {
    this.tabNavNodes = [];
    this.tabInkBar = null;
    return {
      currentValue: this.initialValue
    };
  },
  computed: {
    curIndex() {
      return this.tabMenus.findIndex(x => x.title === this.currentValue);
    }
  },
  methods: {
    initial() {
      // 获取必要的 dom 节点
      this.tabNavNodes = Array.from(this.$refs['navWrap'].querySelectorAll('.tabs-tab'));
      this.tabInkBar = this.$refs['tabInkBar'];
      this.tabContainer = this.$refs['tabContainer'];
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
      this.tabContainer.style.marginLeft = `${-1 * this.curIndex * 100}%`;
    },
    tabNavClickHandle(ev, title) {
      ev.stopPropagation();
      this.currentValue = title;
      this.createTabInkBar();
      this.createTabContentMove();
      // 触发事件
      this.$emit('change', title);
    },
    createTabsNav() {
      return this.tabMenus.map(x => {
        const cls = {
          [`tabs-tab`]: true,
          [`tab-active`]: x.title === this.currentValue
        };
        return (
          <div class={cls} key={x.title} onClick={ev => this.tabNavClickHandle(ev, x.title)}>
            {x.title}
          </div>
        );
      });
    },
    createTabsContent(h) {
      return this.tabMenus.map(x => {
        const component = h(x.component, {
          props: x.params,
          on: x.on
        });
        const cls = {
          [`tabs-tabpane`]: true,
          [`tabs-tabpane-active`]: x.title === this.currentValue
        };
        return (
          <div class={cls}>
            <keep-alive>{component}</keep-alive>
          </div>
        );
      });
    }
  },
  mounted() {
    this.initial();
  },
  render(h) {
    return (
      <div class="tab-wrapper">
        <div class="tab-top-bar">
          <div class="tabs-nav-container">
            <div class="tabs-nav-animated">
              <div ref="navWrap">{this.createTabsNav()}</div>
              <div class="tabs-ink-bar" ref="tabInkBar"></div>
            </div>
          </div>
          <div class="tabs-extra-content">{this.$slots['extraContent']}</div>
        </div>
        <div ref="tabContainer" class="tabs-content tabs-content-animated">
          {this.createTabsContent(h)}
        </div>
      </div>
    );
  }
};
</script>

<style lang="less" scoped>
.tab-wrapper {
  width: 100%;
  overflow: hidden;
  .tab-top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid @borderColor;
    .tabs-nav-container {
      height: 100%;
      margin-bottom: -1px;
      .tabs-nav-animated {
        height: 100%;
        position: relative;
        .tabs-tab {
          display: inline-block;
          padding: 16px 15px;
          transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
          cursor: pointer;
          &.tab-active,
          &:hover {
            color: @primaryColor;
          }
        }
        .tabs-ink-bar {
          position: absolute;
          left: 0;
          bottom: 0;
          height: 2px;
          z-index: 1;
          background-color: @primaryColor;
          transform-origin: 0 50%;
          transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), left 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
      }
    }
    .tabs-extra-content {
      margin-right: @moduleMargin;
    }
  }
  .tabs-content {
    width: 100%;
    .tabs-tabpane {
      flex-shrink: 0;
      width: 100%;
      padding: @modulePadding;
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
