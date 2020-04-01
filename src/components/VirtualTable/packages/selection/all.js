/*
 * @Author: 焦质晔
 * @Date: 2020-03-06 21:30:12
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-01 14:23:49
 */
import Checkbox from '../checkbox';

const noop = () => {};

export default {
  name: 'AllSelection',
  inject: ['$$table'],
  computed: {
    allRowKeys() {
      const { tableFullData, getRowKey, rowSelection } = this.$$table;
      const { rowSelectable = noop } = rowSelection;
      return tableFullData.filter(x => !rowSelectable(x)).map((x, i) => getRowKey(x, i));
    },
    indeterminate() {
      const { selectionKeys } = this.$$table;
      return selectionKeys.length > 0 && selectionKeys.length < this.allRowKeys.length;
    }
  },
  methods: {
    changeHandle(val) {
      this.$$table.selectionKeys = val ? this.allRowKeys : [];
    }
  },
  render() {
    const { selectionKeys } = this.$$table;
    return <Checkbox indeterminate={this.indeterminate} value={!!selectionKeys.length} onInput={this.changeHandle} />;
  }
};
