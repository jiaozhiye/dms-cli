/*
 * @Author: 焦质晔
 * @Date: 2020-03-06 12:05:16
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-08 10:16:30
 */
import Radio from '../radio';
import Checkbox from '../checkbox';

export default {
  name: 'Selection',
  props: ['column', 'record', 'rowKey'],
  inject: ['$$table'],
  methods: {
    renderRadio() {
      const { rowKey, $$table } = this;
      const { selectionKeys, disabledSelectionKeys } = $$table;
      return (
        <Radio
          value={selectionKeys[0]}
          onInput={val => {
            $$table.selectionKeys = [val];
          }}
          trueValue={rowKey}
          falseValue={null}
          disabled={disabledSelectionKeys.includes(rowKey)}
        />
      );
    },
    renderCheckbox() {
      const { rowKey, $$table } = this;
      const { selectionKeys, disabledSelectionKeys } = $$table;
      const prevValue = selectionKeys.includes(rowKey) ? rowKey : null;
      return (
        <Checkbox
          value={prevValue}
          onInput={val => {
            if (val !== null) {
              $$table.selectionKeys = [...new Set([...selectionKeys, val])];
            } else {
              $$table.selectionKeys = selectionKeys.filter(x => x !== prevValue);
            }
          }}
          trueValue={rowKey}
          falseValue={null}
          disabled={disabledSelectionKeys.includes(rowKey)}
        />
      );
    }
  },
  render() {
    const { type } = this.column;
    return type === 'radio' ? this.renderRadio() : this.renderCheckbox();
  }
};
