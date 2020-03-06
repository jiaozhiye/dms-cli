/*
 * @Author: 焦质晔
 * @Date: 2020-03-06 12:05:16
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-06 17:30:36
 */
import Radio from '../radio';
import Checkbox from '../checkbox';

export default {
  name: 'Selection',
  props: ['column', 'record', 'rowKey'],
  inject: ['$$table'],
  methods: {
    changeHandle(val) {
      // console.log(this.$$table.selectionKeys, val);
    },
    renderRadio() {
      const { selectionKeys } = this.$$table;
      console.log(this.rowKey, selectionKeys);
      return (
        <Radio
          value={selectionKeys[0]}
          onInput={val => {
            this.$$table.selectionKeys = [val];
          }}
          trueValue={this.rowKey}
          falseValue={null}
          onChange={this.changeHandle}
        />
      );
    },
    renderCheckbox() {
      return <Checkbox trueValue={this.rowKey} falseValue={null} onChange={this.changeHandle} />;
    }
  },
  render() {
    const { type } = this.column;
    return type === 'radio' ? this.renderRadio() : this.renderCheckbox();
  }
};
