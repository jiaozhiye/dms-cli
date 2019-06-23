<script>
import { mapActions } from 'vuex';

export default {
  name: 'MultiTab',
  data() {
    return {
      activeKey: this.$route.path,
      pages: [this.$route]
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
      this.activeKey = val.path;
      if (!this.pathList.includes(this.activeKey)) {
        const { name = '' } = this.getRouteComponent(val);
        this.addKeepAlive(val);
        this.pages.push(val);
      }
    },
    activeKey(val) {
      this.$router.push({ path: val });
    }
  },
  methods: {
    ...mapActions('app', ['addKeepAliveNames', 'removeKeepAliveNames']),
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
    createPanelList() {
      const Len = this.pages.length;
      return this.pages.map(x => <el-tab-pane key={x.path} name={x.path} label={x.meta.title} closable={Len > 1} />);
    }
  },
  render() {
    return (
      <el-tabs class="multi-tab" type="card" value={this.activeKey} on-tab-click={this.handleClick} on-tab-remove={this.removeTab}>
        {this.createPanelList()}
      </el-tabs>
    );
  }
};
</script>

<style lang="less">
.multi-tab {
  position: relative;
  .el-tabs__header {
    margin: 0;
  }
  .el-tabs__content {
    position: absolute;
    top: 40px;
    left: -40px;
    display: none;
  }
  .el-tabs__nav-wrap {
    &::after {
      background: none;
    }
  }
}
</style>
