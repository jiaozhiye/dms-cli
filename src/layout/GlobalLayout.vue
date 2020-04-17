<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-17 22:47:04
 */
import SideMenu from './modules/SideMenu';
import GlobalHeader from './modules/GlobalHeader';
import HeadNavBar from './modules/HeadNavBar';
import MultiTab from './modules/MultiTab';
import Breadcrumb from './modules/Breadcrumb';

export default {
  name: 'GlobalLayout',
  data() {
    return {
      collapsed: false
    };
  },
  computed: {
    asideWidth() {
      return !this.collapsed ? '200px' : '64px';
    }
  },
  methods: {
    changeHandle(val) {
      this.collapsed = val;
    }
  },
  render() {
    const { $slots = {}, $route, collapsed, asideWidth } = this;
    const bgColor = $route.meta.bgColor ? 'bg-color' : '';
    return (
      <el-container id="app" class="layout">
        <el-aside class="sidebar" style={{ width: asideWidth }}>
          <SideMenu collapsed={collapsed} />
        </el-aside>
        {/* width: 0 -> 解决 IE bug */}
        <el-container style={{ width: 0 }}>
          <el-header>
            <GlobalHeader collapsed={collapsed} toggle={this.changeHandle}>
              <MultiTab slot="menu" />
              <HeadNavBar slot="action" />
            </GlobalHeader>
          </el-header>
          <el-main class={`container ${bgColor}`}>
            <Breadcrumb />
            <section>{$slots.default}</section>
          </el-main>
        </el-container>
      </el-container>
    );
  }
};
</script>

<style lang="less" scoped>
.layout {
  height: 100%;
  .sidebar {
    transition: width 0.3s ease;
    overflow: visible;
  }
  .container {
    padding: 0 10px;
  }
  .bg-color {
    background-color: @backgroundColorSecondary;
  }
}
</style>
