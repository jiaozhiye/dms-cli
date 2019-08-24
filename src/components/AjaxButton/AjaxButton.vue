<script>
export default {
  name: 'AjaxButton',
  props: {
    // 点击执行的方法 必传
    click: {
      type: Function,
      default: null,
      required: true
    },
    // 尺寸 medium / small / mini
    size: {
      type: String,
      default: 'small'
    },
    // 类型 primary / success / warning / danger / info / text
    type: {
      type: String
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否朴素按钮 默认false
    plain: {
      type: Boolean,
      default: false
    },
    // 是否圆角按钮
    round: {
      type: Boolean,
      default: false
    },
    // 是否圆形按钮
    circle: {
      type: Boolean,
      default: false
    },
    // 图标类名
    icon: {
      type: String,
      default: null
    },
    // 是否默认聚焦
    autofocus: {
      type: Boolean,
      default: false
    },
    // 原生 type 属性 button / submit / reset 默认 button
    nativeType: {
      type: String,
      default: 'button'
    }
  },
  data() {
    return {
      ajaxing: false
    };
  },
  computed: {
    btnDisabled() {
      return this.ajaxing || this.disabled;
    }
  },
  methods: {
    async clickHandle() {
      this.ajaxing = true;
      try {
        await this.click();
      } catch (err) {}
      this.ajaxing = false;
    }
  },
  render() {
    const { $props, $listeners, $attrs, $slots } = this;
    const wrapProps = {
      key: 'ajax-btn',
      props: {
        ...$props
      },
      attrs: { ...$attrs },
      on: {
        ...$listeners,
        click: this.clickHandle
      }
    };
    return <el-button {...wrapProps}>{$slots['default']}</el-button>;
  }
};
</script>
