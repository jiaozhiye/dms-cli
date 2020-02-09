<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-02-07 14:04:35
 **/
import _ from 'lodash';

export default {
  name: 'MultiuseButton',
  props: {
    // ajax 防止重复提交，对应的执行方法通过 click 参数传进来
    click: {
      type: Function,
      default: null
    },
    size: {
      type: String,
      default: 'small'
    },
    type: {
      type: String
    },
    plain: {
      type: Boolean,
      default: false
    },
    round: {
      type: Boolean,
      default: false
    },
    circle: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: null
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    nativeType: {
      type: String,
      default: 'button'
    },
    // 分割线
    divider: {
      type: String,
      default: ''
    },
    // 权限校验参数
    authList: {
      type: Array,
      default: null
    },
    authMark: {
      type: String,
      default: ''
    },
    containerStyle: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      ajaxing: false
    };
  },
  computed: {
    isDisabled() {
      return this.ajaxing || this.disabled;
    },
    isVisible() {
      // 没有权限控制，默认该按钮显示状态
      if (!this.authList) return true;
      return this.authList.includes(this.authMark.trim());
    }
  },
  methods: {
    async sleep(timeLen) {
      return new Promise(resolve => setTimeout(resolve, timeLen));
    },
    async clickHandler() {
      this.ajaxing = true;
      try {
        await this.click();
      } catch (err) {}
      await this.sleep(100);
      this.ajaxing = false;
    }
  },
  render() {
    const { $props, $listeners, $attrs, $scopedSlots, $slots, ajaxing, isDisabled, isVisible, containerStyle, divider } = this;
    const ajaxClick = _.isFunction(this.click) ? { click: this.clickHandler } : null;
    const wrapProps = {
      key: 'multiuse-btn',
      props: {
        ...$props,
        loading: ajaxing,
        disabled: isDisabled
      },
      style: {
        ...containerStyle
      },
      on: {
        ...$listeners,
        ...ajaxClick
      },
      attrs: $attrs,
      scopedSlots: $scopedSlots
    };
    const Button = <el-button {...wrapProps}>{$slots['default']}</el-button>;
    const vNode = !divider ? (
      Button
    ) : (
      <span>
        {divider === 'before' && <el-divider direction="vertical" />}
        {Button}
        {divider === 'after' && <el-divider direction="vertical" />}
      </span>
    );
    return isVisible ? vNode : null;
  }
};
</script>
