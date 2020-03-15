/*
 * @Author: 焦质晔
 * @Date: 2020-03-05 22:48:49
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-15 14:36:14
 */
import PropTypes from '@/components/_utils/vue-types';

export default {
  name: 'Radio',
  props: {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).def(false),
    trueValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).def(true),
    falseValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).def(false),
    label: PropTypes.string,
    disabled: PropTypes.bool.def(false)
  },
  data() {
    return {
      currentValue: this.value,
      focusInner: false
    };
  },
  watch: {
    value(val) {
      this.updateValue();
    }
  },
  mounted() {
    this.updateValue();
  },
  methods: {
    change(event) {
      if (this.disabled) return;

      const checked = event.target.checked;
      this.currentValue = checked;

      const value = checked ? this.trueValue : this.falseValue;

      this.$emit('input', value);
      this.$emit('change', value);
    },
    updateValue() {
      this.currentValue = this.value === this.trueValue;
    },
    onBlur() {
      this.focusInner = false;
    },
    onFocus() {
      this.focusInner = true;
    }
  },
  render() {
    const wrapCls = [
      `v-radio-wrapper`,
      {
        [`v-radio-wrapper-checked`]: this.currentValue,
        [`v-radio-wrapper-disabled`]: this.disabled
      }
    ];
    const radioCls = [
      `v-radio`,
      {
        [`v-radio-checked`]: this.currentValue,
        [`v-radio-disabled`]: this.disabled
      }
    ];
    const innerCls = [
      `v-radio-inner`,
      {
        [`v-radio-focus`]: this.focusInner
      }
    ];
    const inputCls = [`v-radio-input`];
    const textCls = [`v-radio-text`];
    return (
      <label class={wrapCls}>
        <span class={radioCls}>
          <span class={innerCls}></span>
          <input type="radio" class={inputCls} disabled={this.disabled} checked={this.currentValue} onChange={this.change} onFocus={this.onFocus} onBlur={this.onBlur} />
        </span>
        {this.label && <span class={textCls}>{this.label}</span>}
      </label>
    );
  }
};
