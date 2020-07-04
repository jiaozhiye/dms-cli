/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-06-20 10:19:16
 **/
import { isFunction } from 'lodash';
import PropTypes from '../_utils/vue-types';
import { sleep } from '../_utils/tool';

export default {
  name: 'MultiuseButton',
  props: {
    // ajax 防止重复提交，对应的执行方法通过 click 参数传进来
    click: PropTypes.func.isRequired,
    size: PropTypes.string,
    type: PropTypes.string,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    icon: PropTypes.string,
    // 分割线
    divider: PropTypes.string,
    // 权限校验参数
    authList: PropTypes.array,
    authMark: PropTypes.string.def(''),
    containerStyle: PropTypes.object.def({})
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
    async clickHandler() {
      this.ajaxing = true;
      try {
        await this.click();
        await sleep(200);
      } catch (err) {}
      this.ajaxing = false;
    }
  },
  render() {
    const { $props, $listeners, $attrs, $slots, ajaxing, isDisabled, isVisible, containerStyle, divider } = this;
    const ajaxClick = isFunction(this.click) ? { click: this.clickHandler } : null;
    const wrapProps = {
      key: 'multiuse-btn',
      props: {
        ...$props,
        loading: ajaxing,
        disabled: isDisabled
      },
      attrs: $attrs,
      style: {
        ...containerStyle
      },
      on: {
        ...$listeners,
        ...ajaxClick
      }
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
