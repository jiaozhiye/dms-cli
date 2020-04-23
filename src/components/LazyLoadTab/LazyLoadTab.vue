<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-23 14:39:44
 **/
import _ from 'lodash';

export default {
  name: 'LazyLoadTab',
  props: {
    initialValue: {
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
    return {
      activeName: this.initialValue
    };
  },
  watch: {
    initialValue(val) {
      this.activeName = val;
    },
    activeName(val) {
      this.loadComponent(val);
      this.$emit('change', val);
    }
  },
  created() {
    this.loadComponent(this.activeName);
  },
  methods: {
    loadComponent(activeName) {
      let { path = '' } = this.tabMenus.find(x => x.title === activeName) || {};
      if (!path) return;
      path = path.endsWith('.vue') ? path : `${path}.vue`;
      // if (this.$options.components[activeName]) return;
      // 动态加载组件
      this.$options.components[activeName] = () => import(`@/pages/${path}`);
    },
    createTabPanel(h) {
      return this.tabMenus.map(x => {
        const isCurrent = x.title === this.activeName;
        // JSX 中的动态组件不能用 <component /> 标签，必须这样实现
        const component = h(this.$options.components[x.title], {
          // 解决 LazyLoadTab 调用时，传入的参数改变，不触发子组件重新渲染的问题
          props: x.params,
          on: x.on
        });
        return (
          <el-tab-pane ref={x.title} key={x.title} label={`　${x.title}　`} name={x.title} disabled={x.disabled} lazy>
            {!this.destroyOnClose ? <keep-alive>{component}</keep-alive> : isCurrent ? component : null}
          </el-tab-pane>
        );
      });
    }
  },
  render(h) {
    const { type, position } = this;
    return (
      <el-tabs
        class="v-lazy-tab--wrapper"
        type={type}
        value={this.activeName}
        tab-position={position}
        onInput={val => {
          this.activeName = val;
        }}
      >
        {this.createTabPanel(h)}
      </el-tabs>
    );
  }
};
</script>

<style lang="scss" scoped>
.v-lazy-tab--wrapper {
  /deep/ .el-tabs__header {
    margin-bottom: $moduleMargin;
    .el-tabs__nav-wrap {
      .el-tabs__item {
        padding: 0 5px;
        height: 34px;
        line-height: 34px;
      }
      &.is-top::after {
        height: 1px;
      }
      &.is-left::after {
        width: 1px;
      }
    }
  }
  /deep/ .el-tabs__content {
    position: static !important;
  }
}
</style>
