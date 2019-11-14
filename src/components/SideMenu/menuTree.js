/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-11-14 08:02:16
 */
import variables from '@/assets/css/variables.less';

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
    },
    syncActive: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      selectedKey: ''
    };
  },
  computed: {
    variables() {
      return variables;
    }
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
                {item.icon ? <i class={item.icon} /> : null}
                <span slot="title">{item.title}</span>
              </template>
              {this.createMenuTree(item.children)}
            </el-submenu>
          );
        }
        return (
          <el-menu-item key={item.key} index={item.key}>
            <span title={item.title} style="display: block;" class="text_overflow_cut">
              {item.title}
            </span>
          </el-menu-item>
        );
      });
    }
  },
  created() {
    this.selectedKey = this.$route.path;
  },
  render() {
    const { collapsed, syncActive, selectedKey, variables } = this;
    const wrapProps = {
      props: {
        collapse: collapsed,
        router: true,
        uniqueOpened: true,
        collapseTransition: false,
        backgroundColor: variables.menuBg,
        textColor: variables.menuText,
        activeTextColor: variables.menuActiveText
      },
      style: { borderRight: 'none' }
    };
    if (syncActive) {
      wrapProps.props.defaultActive = selectedKey;
    }
    return (
      <div>
        <el-menu {...wrapProps}>{this.createMenuTree(this.menu)}</el-menu>
      </div>
    );
  }
};
