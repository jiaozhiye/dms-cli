/*
 * @Author: 焦质晔
 * @Date: 2020-03-06 21:30:12
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-03 18:13:00
 */
import Checkbox from '../checkbox';

const noop = () => {};

export default {
  name: 'AllSelection',
  props: ['selectionKeys'],
  inject: ['$$table'],
  data() {
    return {
      state: false
    };
  },
  computed: {
    allRowKeys() {
      const { tableFullData, getRowKey, rowSelection } = this.$$table;
      const { rowSelectable = noop } = rowSelection;
      return tableFullData.filter(x => !rowSelectable(x)).map((x, i) => getRowKey(x, i));
    },
    indeterminate() {
      return this.selectionKeys.length > 0 && this.selectionKeys.length < this.allRowKeys.length;
    },
    selectable() {
      return this.state && !!this.selectionKeys.length;
    }
  },
  methods: {
    changeHandle(val) {
      this.state = val;
      this.$$table.selectionKeys = val ? this.allRowKeys : [];
    }
  },
  render() {
    return <Checkbox indeterminate={this.indeterminate} value={this.selectable} onInput={this.changeHandle} />;
  }
};
