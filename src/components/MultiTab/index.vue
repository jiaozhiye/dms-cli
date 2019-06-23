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
  watch: {
    $route(val) {
      this.activeKey = val.path;
      if (!this.pathList.includes(this.activeKey)) {
        this.addKeepAliveNames(val.matched[val.matched.length - 1].components.default.name);
        this.pages.push(val);
      }
    },
    activeKey(val) {
      this.$router.push({ path: val });
    }
  },
  methods: {
    ...mapActions('app', ['addKeepAliveNames', 'removeKeepAliveNames']),
    removeTab(targetKey) {
      this.removeKeepAliveNames('Test');
      this.pages = this.pages.filter(page => page.path !== targetKey);
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
