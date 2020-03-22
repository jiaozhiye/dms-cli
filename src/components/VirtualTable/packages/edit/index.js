/*
 * @Author: 焦质晔
 * @Date: 2020-03-22 14:34:21
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-22 16:49:42
 */
export default {
  name: 'CellEdit',
  props: ['column', 'record', 'rowKey', 'rowIndex', 'cellIndex'],
  computed: {
    conf() {
      return this.column.editRender(this.record, this.column, this.rowIndex, this.cellIndex);
    }
  },
  render() {
    return <span>{'张三'}</span>;
  }
};
