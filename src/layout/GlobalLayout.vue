<script>
import SideMenu from '@/components/SideMenu';
import GlobalHeader from '@/components/GlobalHeader';
import MultiTab from '@/components/MultiTab';
import HeadNavBar from '@/components/HeadNavBar';
import Breadcrumb from '@/components/Breadcrumb';

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
      <el-container class="layout">
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
    transition: width 0.3s;
    overflow: visible;
  }
  .container {
    padding: 0 10px;
  }
  .bg-color {
    background-color: @backgroundColor;
  }
}
</style>
