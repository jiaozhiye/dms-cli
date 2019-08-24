<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-05-06 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-05-07 11:00:00
 **/
export default {
  name: 'LazyLoadTab',
  props: {
    value: {
      type: String,
      required: true
    },
    tabMenus: {
      type: Array,
      default() {
        return [];
      }
    },
    type: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      default: 'top'
    },
    destroyOnClose: {
      type: Boolean,
      default: false
    }
  },
  data() {
    // 组件路径的前缀
    this.pathFix = 'pages';
    return {
      activeName: this.value
    };
  },
  created() {
    this.loadComponent();
  },
  methods: {
    loadComponent(tab, ev) {
      this.$emit('input', this.activeName);
      const { path } = this.tabMenus.find(x => x.title === this.activeName);
      // if (this.$options.components[this.activeName]) return;
      // 动态加载组件
      this.$options.components[this.activeName] = () => import(`@/${this.pathFix}/${path}.vue`);
      if (tab) {
        this.$emit('tab-click', tab);
      }
      this.$nextTick(() => {
        if (!this.destroyOnClose) {
          this.$refs[this.activeName].isLoaded = true;
        }
      });
    },
    createTabPanel(h) {
      return this.tabMenus.map(x => {
        // JSX 中的动态组件不能用 <component /> 标签，必须这样实现
        let component = h(this.$options.components[x.title], {
          props: x.params,
          on: x.on
        });
        return (
          <el-tab-pane ref={x.title} key={x.title} label={x.title} name={x.title} disabled={x.disabled} lazy>
            {this.destroyOnClose && x.title === this.activeName ? component : null}
            {!this.destroyOnClose ? <keep-alive>{component}</keep-alive> : null}
          </el-tab-pane>
        );
      });
    }
  },
  render(h) {
    const { type, position, loadComponent } = this;
    return (
      <el-tabs class="topTabMenu" v-model={this.activeName} type={type} tab-position={position} on-tab-click={loadComponent}>
        {this.createTabPanel(h)}
      </el-tabs>
    );
  }
};
</script>

<style lang="less">
.topTabMenu {
  .el-tabs__nav-wrap {
    .el-tabs__item {
      height: 32px;
      line-height: 32px;
    }
    &.is-top::after {
      height: 1px;
    }
    &.is-left::after {
      width: 1px;
    }
  }
}
</style>
