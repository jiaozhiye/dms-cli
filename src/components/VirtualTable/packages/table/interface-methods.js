/*
 * @Author: 焦质晔
 * @Date: 2020-04-14 16:03:27
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-29 11:19:32
 */
import { getCellValue, setCellValue } from '../utils';
import _ from 'lodash';

export default {
  // 计算表格高度
  CALCULATE_HEIGHT() {
    this.$nextTick(() => {
      this.calcTableHeight();
    });
  },
  // 刷新表格数据
  DO_REFRESH() {
    this.getTableData();
  },
  // 获取表格操作记录
  GET_LOG() {
    const { required, validate, updated } = this.$store.state;
    return {
      required: required.map(item => ({ rowKey: item.x, dataIndex: item.y, text: item.text })),
      validate: validate.map(item => ({ rowKey: item.x, dataIndex: item.y, text: item.text })),
      updated
    };
  },
  // 表格数据插入
  INSERT_RECORDS(rows, dir = 'bottom') {
    rows = Array.isArray(rows) ? rows : [rows];
    const tableData = [...this.tableFullData];
    rows.forEach(row => {
      if (typeof row !== 'object') return;
      const funcName = dir === 'top' ? 'unshift' : 'push';
      tableData[funcName](row);
    });
    this.createTableData(tableData, (record, dataIndex) => {
      setCellValue(record, dataIndex, getCellValue(record, dataIndex));
    });
  },
  // 表单校验
  FORM_VALIDATE() {
    const editableColumns = this.flattenColumns.filter(column => _.isFunction(column.editRender));
    this.tableFullData.forEach(record => {
      editableColumns.forEach(column => {
        const { dataIndex, editRender } = column;
        const options = editRender(record);
        if (!options) return;
        const { rules = [], disabled } = options;
        !disabled && this.createFieldValidate(rules, getCellValue(record, dataIndex), this.getRowKey(record, record.index), dataIndex);
      });
    });
    const { required, validate } = this.GET_LOG();
    return { required, validate };
  }
};
