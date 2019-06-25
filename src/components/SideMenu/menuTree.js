/**
 * @Author: 焦质晔
 * @Date: 2019/6/20
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 15:45:00
 */
export default {
  name: 'MenuTree',
  props: {
    menu: {
      type: Array,
      default: () => []
    },
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedKey: ''
    };
  },
  watch: {
    $route({ path }) {
      this.selectedKey = path;
    }
  },
  methods: {
    createMenuTree(arr) {
      return arr.map(item => {
        if (Array.isArray(item.children) && item.children.length) {
          return (
            <el-submenu key={item.key} index={item.key}>
              <template slot="title">
                <i class={item.icon} />
                <span slot="title">{item.title}</span>
              </template>
              {this.createMenuTree(item.children)}
            </el-submenu>
          );
        }
        return (
          <el-menu-item key={item.key} index={item.key}>
            {item.title}
          </el-menu-item>
        );
      });
    }
  },
  created() {
    this.selectedKey = this.$route.path;
  },
  render() {
    const { collapsed, selectedKey } = this;
    return (
      <div>
        <el-menu
          collapse={collapsed}
          router
          collapse-transition={false}
          default-active={selectedKey}
          style={{ borderRight: 'none' }}
          background-color="#001529"
          text-color="rgba(255,255,255,0.65)"
          active-text-color="#1890ff"
        >
          {this.createMenuTree(this.menu)}
        </el-menu>
      </div>
    );
  }
};
