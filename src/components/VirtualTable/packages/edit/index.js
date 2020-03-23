/*
 * @Author: 焦质晔
 * @Date: 2020-03-22 14:34:21
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-23 16:06:07
 */
import _ from 'lodash';
import moment from 'moment';
import { getCellValue, setCellValue } from '../utils';

import Checkbox from '../checkbox';

const noop = () => {};

export default {
  name: 'CellEdit',
  props: ['column', 'record', 'rowKey', 'columnKey', 'clicked'],
  inject: ['$$table', '$$body'],
  data() {
    return {};
  },
  computed: {
    options() {
      return this.column.editRender(this.record, this.column);
    },
    editable() {
      const { editable, disabled } = this.options;
      return (editable || _.isEqual(this.clicked, [this.rowKey, this.columnKey])) && !disabled;
    },
    dataKey() {
      return `${this.rowKey}|${this.columnKey}`;
    }
  },
  methods: {
    textHandle(row, column) {
      const { dataIndex } = column;
      const { extra = {}, onInput = noop, onChange = noop } = this.options;
      const prevValue = getCellValue(row, dataIndex);
      return (
        <el-input
          size="small"
          value={prevValue}
          maxlength={extra.maxlength}
          onInput={val => {
            setCellValue(row, dataIndex, val);
            onInput({ [this.dataKey]: val }, row);
          }}
          onChange={val => {
            onChange({ [this.dataKey]: val }, row);
          }}
        />
      );
    },
    numberHandle(row, column) {
      const { dataIndex, precision } = column;
      const { extra = {}, onInput = noop, onChange = noop } = this.options;
      const prevValue = getCellValue(row, dataIndex);
      const regExp = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
      return (
        <el-input
          size="small"
          value={prevValue}
          onInput={val => {
            let isPassCheck = (!Number.isNaN(val) && regExp.test(val)) || val === '' || val === '-';
            if (!isPassCheck) return;
            // 不允许是负数
            if (extra.min === 0 && val === '-') return;
            let chunks = val.split('.');
            // 判断整型
            if (precision === 0 && chunks.length > 1) return;
            // 判断浮点型
            if (precision > 0 && chunks.length > 1 && chunks[1].length > precision) return;
            // 判断最大值/最小值
            if (Number(val) > extra.max) return;
            if (Number(val) < extra.min) return;
            // 设置数据值
            setCellValue(row, dataIndex, val);
            // input 事件
            onInput({ [this.dataKey]: val }, row);
          }}
          onChange={val => {
            onChange({ [this.dataKey]: val }, row);
          }}
        />
      );
    },
    selectHandle(row, column, isMultiple) {
      const { dataIndex } = column;
      const { extra = {}, items = [], onChange = noop } = this.options;
      const prevValue = getCellValue(row, dataIndex);
      return (
        <el-select
          size="small"
          multiple={isMultiple}
          value={prevValue}
          onInput={val => {
            setCellValue(row, dataIndex, val);
          }}
          placeholder="请选择"
          clearable
          onChange={val => {
            onChange({ [this.dataKey]: val }, row);
          }}
        >
          {items.map(x => (
            <el-option key={x.value} label={x.text} value={x.value} />
          ))}
        </el-select>
      );
    },
    [`select-multipleHandle`](row, column) {
      return this.selectHandle(row, column, true);
    },
    dateHandle(row, column, isDateTime) {
      const { dataIndex } = column;
      const { extra = {}, onChange = noop } = this.options;
      const prevValue = getCellValue(row, dataIndex);
      const dateFormat = !isDateTime ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss';
      return (
        <el-date-picker
          size="small"
          type={!isDateTime ? 'date' : 'datetime'}
          value={moment(prevValue).format(dateFormat.replace('yyyy', 'YYYY').replace('dd', 'DD'))}
          onInput={val => {
            setCellValue(row, dataIndex, val);
          }}
          format={dateFormat}
          value-format={dateFormat}
          clearable={!1}
          placeholder={!isDateTime ? '选择日期' : '选择时间'}
          onChange={val => {
            onChange({ [this.dataKey]: val }, row);
          }}
        />
      );
    },
    datetimeHandle(row, column) {
      return this.dateHandle(row, column, true);
    },
    checkboxHandle(row, column) {
      const { dataIndex } = column;
      const { extra = {}, onChange = noop } = this.options;
      const { trueValue = '1', falseValue = '0', text = '', disabled } = extra;
      const prevValue = getCellValue(row, dataIndex);
      return (
        <Checkbox
          value={prevValue}
          onInput={val => {
            setCellValue(row, dataIndex, val);
          }}
          onChange={val => {
            onChange({ [this.dataKey]: val }, row);
          }}
          trueValue={trueValue}
          falseValue={falseValue}
          label={text}
          disabled={disabled}
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
    },
    renderCell() {
      const { record, column } = this;
      const text = getCellValue(record, column.dataIndex);
      return this.$$body.renderText(text, column);
    }
  },
  render() {
    return this.editable ? this.renderEditCell() : <div>{this.renderCell()}</div>;
  }
};
