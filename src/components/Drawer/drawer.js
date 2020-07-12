/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-07 21:00:42
 **/
import PropTypes from '../_utils/vue-types';
import VDrawer from './VDrawer';
import ContainerRender from './ContainerRender';

export default {
  name: 'Drawer',
  props: {
    visible: PropTypes.bool.def(false),
    size: PropTypes.string,
    closable: PropTypes.bool.def(true),
    destroyOnClose: PropTypes.bool.def(false),
    getContainer: PropTypes.func.def(() => document.body),
    title: PropTypes.string.def(''),
    position: PropTypes.string.def('right'),
    lockScroll: PropTypes.bool.def(true),
    maskClosable: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    zIndex: PropTypes.number.def(100),
    maskStyle: PropTypes.object.def({}),
    containerStyle: PropTypes.object.def({})
  },
  data() {
    this.renderComponent = () => {};
    this.removeContainer = () => {};
    return {
      isVisible: this.visible
    };
  },
  computed: {
    extraParams() {
      return { visible: this.isVisible };
    }
  },
  watch: {
    visible(val) {
      if (val && !this.$refs._component) {
        // 首次进入
        setTimeout(() => (this.isVisible = val));
      } else {
        this.isVisible = val;
      }
    }
  },
  beforeDestroy() {
    this.removeContainer();
  },
  methods: {
    getComponent(extra = {}) {
      const { $attrs, $listeners, $props, $slots } = this;
      const wrapProps = {
        ref: '_component',
        props: {
          ...$props,
          ...this.extraParams
        },
        attrs: { ...$attrs },
        on: { ...$listeners }
      };
      return (
        <VDrawer {...wrapProps}>
          {Object.keys($slots).map(name => (
            <template key={name} slot={name}>
              {$slots[name]}
            </template>
          ))}
        </VDrawer>
      );
    },
    getWrapper() {
      const container = document.createElement('div');
      if (this.getContainer) {
        this.getContainer().appendChild(container);
      } else {
        document.body.appendChild(container);
      }
      return container;
    }
  },
  render() {
    const { visible } = this;
    return (
      <ContainerRender
        parent={this}
        visible={visible}
        getComponent={this.getComponent}
        getContainer={this.getWrapper}
        children={({ renderComponent, removeContainer }) => {
          this.renderComponent = renderComponent;
          this.removeContainer = removeContainer;
          return null;
        }}
      />
    );
  }
};
