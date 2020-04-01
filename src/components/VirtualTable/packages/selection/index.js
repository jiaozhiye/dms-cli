/*
 * @Author: 焦质晔
 * @Date: 2020-03-06 12:05:16
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-01 13:30:02
 */
import Radio from '../radio';
import Checkbox from '../checkbox';

const noop = () => {};

export default {
  name: 'Selection',
  props: ['column', 'record', 'rowKey'],
  inject: ['$$table'],
  methods: {
    setRowSelection(val) {
      this.$$table.selectionKeys = [val];
    },
    toggleRowSelection(val, state) {
      const { selectionKeys } = this.$$table;
      this.$$table.selectionKeys = state ? [...new Set([...selectionKeys, val])] : selectionKeys.filter(x => x !== val);
    },
    renderRadio() {
      const { record, rowKey } = this;
      const {
        selectionKeys,
        rowSelection: { rowSelectable = noop }
      } = this.$$table;
      const disabled = rowSelectable(record);
      const prevValue = !disabled ? selectionKeys[0] : null;
      return (
        <Radio
          value={prevValue}
          onInput={val => {
            // this.setRowSelection(val);
          }}
          trueValue={rowKey}
          falseValue={null}
          disabled={disabled}
        />
      );
    },
    renderCheckbox() {
      const { record, rowKey } = this;
      const {
        selectionKeys,
        rowSelection: { rowSelectable = noop }
      } = this.$$table;
      const disabled = rowSelectable(record);
      const prevValue = !disabled && selectionKeys.includes(rowKey) ? rowKey : null;
      return (
        <Checkbox
          value={prevValue}
          onInput={val => {
            // if (val !== null) {
            //   this.toggleRowSelection(val, true);
            // } else {
            //   this.toggleRowSelection(prevValue, false);
            // }
          }}
          trueValue={rowKey}
          falseValue={null}
          disabled={disabled}
        />
      );
    }
  },
  render() {
    const { type } = this.column;
    return type === 'radio' ? this.renderRadio() : this.renderCheckbox();
  }
};
