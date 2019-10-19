<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-05-06 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-05-07 11:00:00
 **/
import _ from 'lodash';

export default {
  name: 'LazyLoadTab',
  props: {
    value: {
      type: String,
      required: true
    },
    tabMenus: {
      type: Array,
      default: () => []
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
  watch: {
    value(nextProps) {
      this.activeName = nextProps;
      this.loadComponent(nextProps);
    }
  },
  methods: {
    loadComponent(activeName) {
      const { path } = this.tabMenus.find(x => x.title === activeName) || {};
      if (!path) return;
      // if (this.$options.components[activeName]) return;
      // 动态加载组件
      this.$options.components[activeName] = () => import(`@/${this.pathFix}/${path}.vue`);
      this.$nextTick(() => {
        // 触发自定义事件
        this.$emit('tab-click', this.$refs[activeName]);
        if (!this.destroyOnClose) {
          this.$refs[activeName].isLoaded = true;
        }
      });
    },
    clickHandler() {
      this.$emit('input', this.activeName);
    },
    createTabPanel(h) {
      return this.tabMenus.map(x => {
        // JSX 中的动态组件不能用 <component /> 标签，必须这样实现
        const component = h(this.$options.components[x.title], {
          // 解决 LazyLoadTab 调用时，传入的参数改变，不触发子组件重新渲染的问题
          props: x.params,
          on: x.on
        });
        return (
          <el-tab-pane ref={x.title} key={x.title} label={x.title} name={x.title} disabled={x.disabled} lazy>
            {this.destroyOnClose && x.title === this.value ? component : null}
            {!this.destroyOnClose ? <keep-alive>{component}</keep-alive> : null}
          </el-tab-pane>
        );
      });
    }
  },
  created() {
    this.loadComponent(this.value);
  },
  render(h) {
    const { type, position } = this;
    return (
      <el-tabs class="lazyLoadTab" v-model={this.activeName} type={type} tab-position={position} on-tab-click={this.clickHandler}>
        {this.createTabPanel(h)}
      </el-tabs>
    );
  }
};
</script>

<style lang="less">
.lazyLoadTab {
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
  .el-tabs__content {
    position: static !important;
  }
}
</style>
