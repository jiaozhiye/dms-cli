/*
 * @Author: 焦质晔
 * @Date: 2020-03-22 14:34:21
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-23 09:58:54
 */
import _ from 'lodash';
import { getCellValue, setCellValue } from '../utils';

export default {
  name: 'CellEdit',
  props: ['column', 'record', 'rowKey', 'columnKey', 'clicked'],
  inject: ['$$table'],
  data() {
    return {};
  },
  computed: {
    options() {
      return this.column.editRender(this.record, this.column);
    },
    editable() {
      return _.isEqual(this.clicked, [this.rowKey, this.columnKey]);
    }
  },
  methods: {
    textHandle(row, column) {
      const { dataIndex } = column;
      const prevValue = getCellValue(row, dataIndex);
      return (
        <el-input
          size="mini"
          value={prevValue}
          onInput={val => {
            setCellValue(row, dataIndex, val);
          }}
        />
      );
    },
    renderEditCell() {
      const { type } = this.options;
      const render = this[`${type}Handle`];
      if (!render) {
        console.error('[Table]: 单元格编辑的类型 `type` 配置不正确');
        return null;
      }
      return <div>{render(this.record, this.column)}</div>;
    }
  },
  render() {
    const { record, column, editable } = this;
    const { dataIndex } = column;
    return editable ? this.renderEditCell() : <span>{getCellValue(record, dataIndex)}</span>;
  }
};
