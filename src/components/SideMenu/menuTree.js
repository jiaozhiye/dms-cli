/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-11-26 08:49:03
 */
import _ from 'lodash';
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
        const { key, title, icon } = item;
        const menuItemNode = (
          <template slot="title">
            {icon && <i class={icon} />}
            <span title={title}>{title}</span>
          </template>
        );
        if (Array.isArray(item.children)) {
          return (
            <el-submenu key={key || title} index={key || title}>
              {menuItemNode}
              {this.createMenuTree(item.children)}
            </el-submenu>
          );
        }
        return (
          <el-menu-item key={key} index={key}>
            {menuItemNode}
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
