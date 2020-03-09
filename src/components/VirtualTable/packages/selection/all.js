/*
 * @Author: 焦质晔
 * @Date: 2020-03-06 21:30:12
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-09 10:56:07
 */
import Checkbox from '../checkbox';

export default {
  name: 'AllSelection',
  inject: ['$$table'],
  computed: {
    allRowKeys() {
      const { tableFullData, getRowKey } = this.$$table;
      return tableFullData.map((record, i) => getRowKey(record, i));
    },
    indeterminate() {
      const { selectionKeys } = this.$$table;
      return selectionKeys.length > 0 && selectionKeys.length < this.allRowKeys.length;
    }
  },
  methods: {
    changeHandle(val) {
      const { $$table, allRowKeys } = this;
      if (val) {
        $$table.selectionKeys = allRowKeys;
      } else {
        $$table.selectionKeys = [];
      }
    }
  },
  render() {
    return <Checkbox indeterminate={this.indeterminate} trueValue={true} falseValue={false} onChange={this.changeHandle} />;
  }
};
