<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 10:00:00
 **/
import Drawer from './Drawer';
import ContainerRender from '@/utils/ContainerRender';

export default {
  name: 'VcDrawer',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    closable: {
      type: Boolean,
      default: true
    },
    destroyOnClose: {
      type: Boolean,
      default: false
    },
    getContainer: {
      type: Function,
      default: () => document.body
    },
    title: {
      type: String,
      default: '标题'
    },
    position: {
      type: String,
      default: 'right'
    },
    lockScroll: {
      type: Boolean,
      default: true
    },
    maskClosable: {
      type: Boolean,
      default: false
    },
    width: {
      type: [Number, String],
      default: '500'
    },
    height: {
      type: [Number, String],
      default: '300'
    },
    zIndex: {
      type: Number,
      default: 100
    },
    maskStyle: {
      type: Object,
      default: () => ({})
    },
    containerStyle: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    this.renderComponent = () => {};
    this.removeContainer = () => {};
    return {
      isVisible: this.visible
    };
  },
  watch: {
    visible(val) {
      if (val && !this.$refs._component) {
        // 首次进入
        setTimeout(() => (this.isVisible = val), 20);
      } else {
        this.isVisible = val;
      }
    }
  },
  computed: {
    extraParams() {
      return { visible: this.isVisible };
    }
  },
  beforeDestroy() {
    this.removeContainer();
  },
  methods: {
    getComponent(extra = {}) {
      const { $attrs, $listeners, $props, $slots } = this;
      const wrapProps = {
        key: 'drawer',
        ref: '_component',
        props: {
          ...$props,
          ...this.extraParams
        },
        attrs: { ...$attrs },
        on: { ...$listeners }
      };
      return (
        <Drawer {...wrapProps}>
          {Object.keys($slots).map(name => (
            <template key={name} slot={name}>
              {$slots[name]}
            </template>
          ))}
        </Drawer>
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
</script>
