/**
 * @Author: 焦质晔
 * @Date: 2019/6/20
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 15:45:00
 */
import Vue from 'vue';

export default {
  props: {
    autoMount: {
      type: Boolean,
      default: true
    },
    autoDestroy: {
      type: Boolean,
      default: true
    },
    visible: {
      type: Boolean
    },
    forceRender: {
      type: Boolean,
      default: false
    },
    // 任意类型
    parent: {
      type: null
    },
    getComponent: {
      type: Function,
      required: true
    },
    getContainer: {
      type: Function,
      required: true
    },
    children: {
      type: Function,
      required: true
    }
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
