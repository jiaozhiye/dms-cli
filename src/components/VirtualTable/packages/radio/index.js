/*
 * @Author: 焦质晔
 * @Date: 2020-03-05 22:48:49
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-06 13:42:51
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
      focusWrapper: false,
      focusInner: false
    };
  },
  watch: {
    value(val) {
      if (val === this.trueValue || val === this.falseValue) {
        this.updateValue();
      } else {
        console.warn('[Table Radio]:Value should be trueValue or falseValue.');
      }
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
      this.focusWrapper = false;
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
    return (
      <label class={wrapCls}>
        <span class={radioCls}>
          <span class={innerCls}></span>
          <input type="radio" class={inputCls} disabled={this.disabled} checked={this.currentValue} onChange={this.change} onFocus={this.onFocus} onBlur={this.onBlur} />
        </span>
        {this.label && <span>{this.label}</span>}
      </label>
    );
  }
};
