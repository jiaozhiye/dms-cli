/*
 * @Author: 焦质晔
 * @Date: 2020-03-08 17:57:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-06 18:36:37
 */
import PropTypes from '../_utils/vue-types';
import { filterEmpty, getListeners } from '../_utils/props-util';
import Size from '../_utils/mixins/size';
import PrefixCls from '../_utils/mixins/prefix-cls';

export default {
  name: 'Spin',
  mixins: [Size, PrefixCls],
  props: {
    spinning: PropTypes.bool.def(false),
    size: PropTypes.oneOf(['small', 'default', 'large']),
    delay: PropTypes.number.def(100),
    tip: PropTypes.string,
    containerStyle: PropTypes.object
  },
  data() {
    return {
      sSpinning: this.spinning
    };
  },
  watch: {
    spinning(val) {
      this.stopTimer();
      if (!val) {
        this.sSpinning = val;
      } else {
        this.timer = setTimeout(() => (this.sSpinning = val), this.delay);
      }
    }
  },
  destroyed() {
    this.stopTimer();
  },
  methods: {
    stopTimer() {
      this.timer && clearTimeout(this.timer);
    },
    getChildren() {
      if (this.$slots && this.$slots.default) {
        return filterEmpty(this.$slots.default);
      }
      return null;
    },
    renderIndicator(prefixCls) {
      return (
        <span class={`${prefixCls}-dot ${prefixCls}-dot-spin`}>
          <i />
          <i />
          <i />
          <i />
        </span>
      );
    }
  },
  render() {
    const { tip, containerStyle, ...restProps } = this.$props;
    const { sSpinning } = this;

    const prefixCls = this.getPrefixCls('spin');
    const spinClassName = {
      [prefixCls]: true,
      [`${prefixCls}-sm`]: this.currentSize === 'small',
      [`${prefixCls}-lg`]: this.currentSize === 'large',
      [`${prefixCls}-spinning`]: sSpinning,
      [`${prefixCls}-show-text`]: !!tip
    };

    const spinElement = (
      <div {...restProps} class={spinClassName}>
        {this.renderIndicator(prefixCls)}
        {tip ? <div class={`${prefixCls}-text`}>{tip}</div> : null}
      </div>
    );

    const children = this.getChildren();

    if (children) {
      const containerClassName = {
        [`${prefixCls}-container`]: true,
        [`${prefixCls}-blur`]: sSpinning
      };
      return (
        <div {...{ on: getListeners(this) }} class={`${prefixCls}-nested-loading`} style={containerStyle}>
          {sSpinning && <div key="loading">{spinElement}</div>}
          <div key="container" class={containerClassName} style={containerStyle}>
            {children}
          </div>
        </div>
      );
    }

    return spinElement;
  }
};
