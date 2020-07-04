/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-25 12:49:13
 */
import Vue from 'vue';
import PropTypes from '../_utils/vue-types';

export default {
  props: {
    autoMount: PropTypes.bool.def(true),
    autoDestroy: PropTypes.bool.def(true),
    visible: PropTypes.bool,
    forceRender: PropTypes.bool.def(false),
    // 任意类型
    parent: PropTypes.any,
    getComponent: PropTypes.func.isRequired,
    getContainer: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired
  },
  data() {
    this.componentEl = null;
    return {};
  },
  mounted() {
    if (this.autoMount) {
      this.renderComponent();
    }
  },
  updated() {
    if (this.autoMount) {
      this.renderComponent();
    }
  },
  beforeDestroy() {
    if (this.autoDestroy) {
      this.removeContainer();
    }
  },
  methods: {
    removeContainer() {
      if (this.container) {
        this._component && this._component.$destroy();
        this.container.parentNode.removeChild(this.container);
        this.container = null;
        this._component = null;
      }
    },
    renderComponent(props = {}, ready) {
      const { visible, forceRender, getContainer, parent } = this;
      const _this = this;
      if (visible || parent.$refs._component || forceRender) {
        if (!this.container) {
          this.container = getContainer();
        }
        if (!this.componentEl) {
          this.componentEl = document.createElement('div');
          this.container.appendChild(this.componentEl);
        }
        if (!this._component) {
          this._component = new Vue({
            el: this.componentEl, // 把 _this.getComponent() 渲染到 el 容器中
            parent: _this.parent,
            data: {
              comProps: props
            },
            mounted() {
              this.$nextTick(() => {
                ready && ready.call(_this);
              });
            },
            updated() {
              this.$nextTick(() => {
                ready && ready.call(_this);
              });
            },
            render() {
              return _this.getComponent(this.comProps);
            }
          });
        } else {
          this._component.comProps = props;
        }
      }
    }
  },
  render() {
    return this.children({
      renderComponent: this.renderComponent,
      removeContainer: this.removeContainer
    });
  }
};
