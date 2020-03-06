/*
 * @Author: 焦质晔
 * @Date: 2020-03-06 01:13:44
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-06 20:16:58
 */
import PropTypes from '@/components/_utils/vue-types';

export default {
  name: 'Checkbox',
  props: {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).def(false),
    trueValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).def(true),
    falseValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).def(false),
    label: PropTypes.string,
    disabled: PropTypes.bool.def(false),
    indeterminate: PropTypes.bool.def(false)
  },
  data() {
    return {
      currentValue: this.value,
      focusInner: false
    };
  },
  watch: {
    value(val) {
      this.updateModel();
    }
  },
  mounted() {
    this.updateModel();
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
    updateModel() {
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
      `v-checkbox-wrapper`,
      {
        [`v-checkbox-wrapper-checked`]: this.currentValue,
        [`v-checkbox-wrapper-disabled`]: this.disabled
      }
    ];
    const checkboxCls = [
      `v-checkbox`,
      {
        [`v-checkbox-checked`]: this.currentValue,
        [`v-checkbox-disabled`]: this.disabled,
        [`v-checkbox-indeterminate`]: this.indeterminate
      }
    ];
    const innerCls = [
      `v-checkbox-inner`,
      {
        [`v-checkbox-focus`]: this.focusInner
      }
    ];
    const inputCls = [`v-checkbox-input`];
    return (
      <label class={wrapCls}>
        <span class={checkboxCls}>
          <span class={innerCls}></span>
          <input type="checkbox" class={inputCls} disabled={this.disabled} checked={this.currentValue} onChange={this.change} onFocus={this.onFocus} onBlur={this.onBlur} />
        </span>
        {this.label && <span>{this.label}</span>}
      </label>
    );
  }
};
