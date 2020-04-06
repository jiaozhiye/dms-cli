/*
 * @Author: 焦质晔
 * @Date: 2020-03-08 17:57:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-06 13:33:59
 */
import PropTypes from '@/components/_utils/vue-types';
import { filterEmpty, getListeners } from '@/components/_utils/props-util';

export default {
  name: 'Spin',
  props: {
    spinning: PropTypes.bool.def(false),
    size: PropTypes.oneOf(['small', 'default', 'large']).def('default'),
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
    renderIndicator() {
      return (
        <span class={`v-spin-dot v-spin-dot-spin`}>
          <i />
          <i />
          <i />
          <i />
        </span>
      );
    }
  },
  render() {
    const { size, tip, containerStyle, ...restProps } = this.$props;
    const { sSpinning } = this;

    const spinClassName = {
      [`v-spin`]: true,
      [`v-spin-sm`]: size === 'small',
      [`v-spin-lg`]: size === 'large',
      [`v-spin-spinning`]: sSpinning,
      [`v-spin-show-text`]: !!tip
    };

    const spinElement = (
      <div {...restProps} class={spinClassName}>
        {this.renderIndicator()}
        {tip ? <div class={`v-spin-text`}>{tip}</div> : null}
      </div>
    );

    const children = this.getChildren();

    if (children) {
      const containerClassName = {
        [`v-spin-container`]: true,
        [`v-spin-blur`]: sSpinning
      };
      // 外层容器 style 样式
      const wrapperStyle = sSpinning && containerStyle ? containerStyle : null;
      return (
        <div {...{ on: getListeners(this) }} class={`v-spin-nested-loading`} style={wrapperStyle}>
          {sSpinning && <div key="loading">{spinElement}</div>}
          <div key="container" class={containerClassName}>
            {children}
          </div>
        </div>
      );
    }

    return spinElement;
  }
};
