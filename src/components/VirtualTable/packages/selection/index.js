/*
 * @Author: 焦质晔
 * @Date: 2020-03-06 12:05:16
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-30 15:35:56
 */
import Radio from '../radio';
import Checkbox from '../checkbox';

const noop = () => {};

export default {
  name: 'Selection',
  props: ['column', 'record', 'rowKey'],
  inject: ['$$table'],
  methods: {
    renderRadio() {
      const { record, rowKey } = this;
      const {
        selectionKeys,
        rowSelection: { rowSelectable = noop }
      } = this.$$table;
      return (
        <Radio
          value={selectionKeys[0]}
          onInput={val => {
            this.$$table.selectionKeys = [val];
          }}
          trueValue={rowKey}
          falseValue={null}
          disabled={rowSelectable(record)}
        />
      );
    },
    renderCheckbox() {
      const { record, rowKey } = this;
      const {
        selectionKeys,
        rowSelection: { rowSelectable = noop }
      } = this.$$table;
      const prevValue = selectionKeys.includes(rowKey) ? rowKey : null;
      return (
        <Checkbox
          value={prevValue}
          onInput={val => {
            const res = val !== null ? [...new Set([...selectionKeys, val])] : selectionKeys.filter(x => x !== prevValue);
            this.$$table.selectionKeys = res;
          }}
          trueValue={rowKey}
          falseValue={null}
          disabled={rowSelectable(record)}
        />
      );
    }
  },
  render() {
    const { type } = this.column;
    return type === 'radio' ? this.renderRadio() : this.renderCheckbox();
  }
};
