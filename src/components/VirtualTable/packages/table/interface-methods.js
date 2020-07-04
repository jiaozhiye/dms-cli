/*
 * @Author: 焦质晔
 * @Date: 2020-04-14 16:03:27
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-06-30 17:26:30
 */
import { getCellValue, setCellValue, tableDataFlatMap } from '../utils';
import { intersection, isObject, isFunction } from 'lodash';

export default {
  // 计算表格高度
  CALCULATE_HEIGHT() {
    this.$nextTick(() => this.calcTableHeight());
  },
  // 刷新表格数据
  DO_REFRESH() {
    this.clearRowSelection();
    this.getTableData();
  },
  // 获取表格操作记录
  GET_LOG() {
    const { required, validate, inserted, updated, removed } = this.store.state;
    // 求 inserted, removed 的交集
    const intersections = intersection(inserted, removed);
    return {
      required: required.map(item => ({ rowKey: item.x, dataIndex: item.y, text: item.text })),
      validate: validate.map(item => ({ rowKey: item.x, dataIndex: item.y, text: item.text })),
      inserted: inserted.filter(row => !intersections.includes(row)),
      updated: updated.filter(row => ![...intersection(updated, inserted), ...intersection(updated, removed)].includes(row)),
      removed: removed.filter(row => !intersections.includes(row))
    };
  },
  // 清空表格操作记录
  CLEAR_LOG() {
    this.clearTableLog();
  },
  // 表格数据插入
  INSERT_RECORDS(rows, dir = 'bottom') {
    rows = (Array.isArray(rows) ? rows : [rows]).filter(row => isObject(row));
    // 处理插入数据
    const tableData = dir === 'bottom' ? [...this.tableOriginData, ...rows] : [...rows, ...this.tableOriginData];
    // 清空表头筛选和排序
    this.clearTableSorter();
    this.clearTableFilter();
    // 重新创建表格数据
    this.createTableData(tableData, (record, dataIndex) => setCellValue(record, dataIndex, getCellValue(record, dataIndex)));
    // 添加表格操作记录
    rows.forEach(row => this.store.addToInserted(row));
    // 滚动条定位
    if (rows.length > 0) {
      let current = dir === 'bottom' ? rows[rows.length - 1] : rows[0];
      this.$nextTick(() => this.$$tableBody.scrollYToRecord(this.getRowKey(current, current.index)));
    }
  },
  // 删除数据
  REMOVE_RECORDS(rows) {
    rows = Array.isArray(rows) ? rows : [rows];
    const rowKeys = rows.filter(x => !!x).map(x => (isObject(x) ? this.getRowKey(x, x.index) : x));
    const editableColumns = this.flattenColumns.filter(column => isFunction(column.editRender));
    for (let i = 0; i < this.tableFullData.length; i++) {
      const row = this.tableFullData[i];
      const rowKey = this.getRowKey(row, row.index);
      if (rowKeys.includes(rowKey)) {
        this.store.addToRemoved(row);
        // 移除表单校验记录
        editableColumns.forEach(column => {
          const { dataIndex, editRender } = column;
          const options = editRender(row);
          if (!options) return;
          const { rules = [], disabled } = options;
          if (!disabled && rules.length) {
            this.store.removeFromRequired({ x: rowKey, y: dataIndex });
            this.store.removeFromValidate({ x: rowKey, y: dataIndex });
          }
        });
        // 移除选择列数据
        if (this.selectionKeys.includes(rowKey)) {
          this.removeSelectionKey(rowKey);
        }
        // 移除展开行数据
        if (this.rowExpandedKeys.includes(rowKey)) {
          this.removeExpandableKey(rowKey);
        }
        // 移除数据
        this.tableFullData.splice(i--, 1);
      }
    }
    // 重新创建表格数据
    this.createTableData(this.tableFullData);
  },
  // 表单校验
  FORM_VALIDATE() {
    const editableColumns = this.flattenColumns.filter(column => isFunction(column.editRender));
    tableDataFlatMap(this.tableFullData).forEach(record => {
      editableColumns.forEach(column => {
        const { dataIndex, editRender } = column;
        const options = editRender(record);
        if (!options) return;
        const { rules = [], disabled } = options;
        if (!disabled && rules.length) {
          this.createFieldValidate(rules, getCellValue(record, dataIndex), this.getRowKey(record, record.index), dataIndex);
        }
      });
    });
    const { required, validate } = this.GET_LOG();
    const result = [...required, ...validate];
    // 定位未通过校验的字段
    if (result.length) {
      this.$$tableBody.scrollYToRecord(result[0].rowKey);
    }
    return { required, validate };
  }
};
