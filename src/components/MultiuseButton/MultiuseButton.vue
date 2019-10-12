<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-05-06 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-05-07 11:00:00
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
    // 权限校验参数
    authList: {
      type: Array,
      default: () => []
    },
    authMark: {
      type: String,
      default: ''
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
      return this.authList.includes(this.authMark);
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
    const { $props, $listeners, $attrs, $scopedSlots, $slots, ajaxing, isDisabled, isVisible } = this;
    const ajaxClick = _.isFunction(this.click) ? { click: this.clickHandler } : null;
    const wrapProps = {
      key: 'multiuse-btn',
      props: {
        ...$props,
        loading: ajaxing,
        disabled: isDisabled
      },
      on: {
        ...$listeners,
        ...ajaxClick
      },
      attrs: $attrs,
      scopedSlots: $scopedSlots
    };
    return isVisible ? <el-button {...wrapProps}>{$slots['default']}</el-button> : null;
  }
};
</script>
