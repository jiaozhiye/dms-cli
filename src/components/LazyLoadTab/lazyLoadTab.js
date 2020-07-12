/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-06 18:36:24
 **/
import PropTypes from '../_utils/vue-types';
import Size from '../_utils/mixins/size';
import PrefixCls from '../_utils/mixins/prefix-cls';

export default {
  name: 'LazyLoadTab',
  mixins: [Size, PrefixCls],
  props: {
    initialValue: PropTypes.string.isRequired,
    tabMenus: PropTypes.arrayOf(
      PropTypes.shape({
        path: PropTypes.string,
        title: PropTypes.string
      }).loose
    ).isRequired,
    size: PropTypes.oneOf(['small', 'default', 'large']),
    type: PropTypes.string.def(''),
    position: PropTypes.string.def('top'),
    destroyOnClose: PropTypes.bool.def(false)
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
    const prefixCls = this.getPrefixCls('lazy-tab--wrapper');
    const cls = {
      [prefixCls]: true,
      [`${prefixCls}-sm`]: this.currentSize === 'small',
      [`${prefixCls}-lg`]: this.currentSize === 'large'
    };
    return (
      <el-tabs
        class={cls}
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
