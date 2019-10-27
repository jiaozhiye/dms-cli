<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 10:00:00
 **/
import { mapActions } from 'vuex';
import addEventListener from 'add-dom-event-listener';

export default {
  name: 'MultiTab',
  data() {
    this.$multiTab = null; // DOM 节点
    return {
      activeKey: this.$route.path,
      pages: [this.$route],
      visible: false,
      currentKey: '',
      position: { x: 0, y: 0 }
    };
  },
  computed: {
    pathList() {
      return this.pages.map(x => x.path);
    }
  },
  created() {
    this.addKeepAlive(this.$route);
  },
  watch: {
    $route(val) {
      if (this.isRedirect(val.path)) return;
      this.activeKey = val.path;
      this.addKeepAlive(val);
      if (!this.pathList.includes(this.activeKey)) {
        this.pages.push(val);
      }
    },
    pages(val) {
      this.createTabMenuList(val.map(x => ({ key: x.path, title: x.meta.title })));
    },
    activeKey(val) {
      this.$router.push({ path: val });
    },
    visible(val) {
      if (val) {
        document.body.addEventListener('click', this.closeContextMenu);
      } else {
        document.body.removeEventListener('click', this.closeContextMenu);
      }
    }
  },
  methods: {
    ...mapActions('app', ['addKeepAliveNames', 'removeKeepAliveNames', 'createTabMenuList', 'refreshView']),
    isRedirect(path) {
      return path.startsWith('/redirect');
    },
    getRouteComponent(route) {
      return route.matched[route.matched.length - 1].components.default;
    },
    addKeepAlive(route) {
      if (!route.meta.keepAlive) return;
      const { name = '' } = this.getRouteComponent(route);
      // 添加组件缓存列表
      this.addKeepAliveNames({ key: this.activeKey, value: name });
    },
    removeTab(targetKey) {
      this.pages = this.pages.filter(page => page.path !== targetKey);
      // 移除组件缓存列表
      this.removeKeepAliveNames(targetKey);
      // 判断当前标签是否关闭，若关闭则跳转到最后一个还存在的标签页
      if (!this.pathList.includes(this.activeKey)) {
        this.activeKey = this.pathList[this.pathList.length - 1];
      }
    },
    handleClick(tab, ev) {
      this.activeKey = tab.name;
    },
    findCurTagIndex() {
      return this.pages.findIndex(x => x.path === this.currentKey);
    },
    refreshTagHandle() {
      this.activeKey = this.currentKey;
      this.refreshView(this.activeKey);
    },
    closeOtherTagHandle() {
      const index = this.findCurTagIndex();
      if (index === -1) return;
      this.pages.forEach(({ path }, i) => {
        if (i === index) return;
        this.removeTab(path);
      });
      this.activeKey = this.currentKey;
    },
    closeTagHandle(dir) {
      const index = this.findCurTagIndex();
      if (index === -1) return;
      let isClosed = false;
      this.pages.forEach(({ path }, i) => {
        if (dir === 'right' && i > index) {
          if (path === this.activeKey) {
            isClosed = true;
          }
          this.removeTab(path);
        }
        if (dir === 'left' && i < index) {
          if (path === this.activeKey) {
            isClosed = true;
          }
          this.removeTab(path);
        }
      });
      if (isClosed) {
        this.activeKey = this.currentKey;
      }
    },
    showContextMenu(key) {
      this.currentKey = key;
      this.visible = true;
    },
    closeContextMenu() {
      this.visible = false;
    },
    bindContextmenuEvent() {
      this.eventHandler = addEventListener(this.$multiTab, 'contextmenu', ev => {
        ev.preventDefault();
        const classNames = [...ev.target.classList];
        if (classNames.includes('el-tabs__item')) {
          const path = ev.target.getAttribute('aria-controls').replace(/^pane-/, '');
          // if (this.activeKey !== path) {
          //   return this.closeContextMenu();
          // }
          this.position.x = ev.clientX || ev.pageX;
          this.position.y = ev.clientY || ev.pageY;
          this.showContextMenu(path);
        }
      });
    },
    createPanelList() {
      return this.pages.map(x => <el-tab-pane key={x.path} name={x.path} label={x.meta.title} closable={this.pages.length > 1} />);
    }
  },
  render() {
    return (
      <div class="multi-wrap">
        <el-tabs ref="multiTab" class="multi-tab" type="card" value={this.activeKey} on-tab-click={this.handleClick} on-tab-remove={this.removeTab}>
          {this.createPanelList()}
        </el-tabs>
        {this.visible ? (
          <ul class="contextmenu el-dropdown-menu--small" style={{ left: `${this.position.x + 10}px`, top: `${this.position.y + 2}px` }}>
            <el-dropdown-item nativeOnClick={this.refreshTagHandle}>刷新当前</el-dropdown-item>
            <el-dropdown-item nativeOnClick={() => this.closeTagHandle('right')}>关闭右侧</el-dropdown-item>
            <el-dropdown-item nativeOnClick={() => this.closeTagHandle('left')}>关闭左侧</el-dropdown-item>
            {this.pages.length > 1 && <el-dropdown-item nativeOnClick={this.closeOtherTagHandle}>关闭其他</el-dropdown-item>}
          </ul>
        ) : null}
      </div>
    );
  },
  mounted() {
    this.$multiTab = this.$refs.multiTab.$el;
    this.bindContextmenuEvent();
  },
  beforeDestroy() {
    this.eventHandler.remove();
  }
};
</script>

<style lang="less" scoped>
.multi-wrap {
  /deep/ .multi-tab {
    position: relative;
    .el-tabs__header {
      margin: 0;
      border-bottom-color: @borderColor;
      .el-tabs__nav {
        border-color: @borderColor;
        .el-tabs__item {
          border-left-color: @borderColor;
        }
      }
    }
    .el-tabs__content {
      display: none !important;
    }
  }
  /deep/ .contextmenu {
    list-style: none;
    min-width: 90px;
    position: fixed;
    left: 300px;
    top: 50px;
    background-color: #fff;
    padding: 6px 0;
    border: 1px solid @borderColorSecondary;
    border-radius: @borderRadius;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    z-index: 9999;
  }
}
</style>
