/*
 * @Author: 焦质晔
 * @Date: 2020-03-22 14:34:21
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-15 16:46:50
 */
import { mapState, mapActions } from 'vuex';
import _ from 'lodash';
import moment from 'moment';
import { getCellValue, setCellValue, isEmpty } from '../utils';

import Checkbox from '../checkbox';

const noop = () => {};

export default {
  name: 'CellEdit',
  props: ['column', 'record', 'rowKey', 'columnKey', 'clicked'],
  inject: ['$$table', '$$body'],
  computed: {
    ...mapState(['required', 'validate']),
    options() {
      return this.column.editRender(this.record, this.column);
    },
    editable() {
      const { editable, disabled } = this.options;
      return (editable || _.isEqual(this.clicked, [this.rowKey, this.columnKey])) && !disabled;
    },
    dataKey() {
      return `${this.rowKey}|${this.columnKey}`;
    },
    currentKey() {
      return this.clicked.length === 2 ? `${this.clicked[0]}|${this.clicked[1]}` : '';
    },
    passValidate() {
      return ![...this.required, ...this.validate].some(({ x, y }) => x === this.rowKey && y === this.columnKey);
    },
    requiredText() {
      const { text } = this.required.find(({ x, y }) => x === this.rowKey && y === this.columnKey) || {};
      return text;
    },
    validateText() {
      const { text } = this.validate.find(({ x, y }) => x === this.rowKey && y === this.columnKey) || {};
      return text;
    }
  },
  watch: {
    clicked() {
      if (!this.editable) return;
      const { type } = this.options;
      const { currentKey } = this;
      if ((type === 'text' || type === 'number') && currentKey) {
        setTimeout(() => {
          let $el = this.$refs[`${type}-${currentKey}`];
          $el && $el.select();
        });
      }
    }
  },
  methods: {
    ...mapActions(['addToRequired', 'removeFromRequired', 'addToValidate', 'removeFromValidate']),
    createFieldValidate(rules, val) {
      if (!Array.isArray(rules)) {
        return console.error('[Table]: 可编辑单元格的校验规则 `rules` 配置不正确');
      }
      if (!rules.length) return;
      const { rowKey, columnKey } = this;
      this.removeFromRequired({ x: rowKey, y: columnKey });
      this.removeFromValidate({ x: rowKey, y: columnKey });
      rules.forEach(x => {
        if (x.required && isEmpty(val)) {
          this.addToRequired({ x: rowKey, y: columnKey, text: x.message });
        }
        if (_.isFunction(x.validator) && x.validator(val)) {
          this.addToValidate({ x: rowKey, y: columnKey, text: x.message });
        }
      });
    },
    textHandle(row, column) {
      const { dataIndex } = column;
      const { extra = {}, rules = [], onInput = noop, onChange = noop, onEnter = noop } = this.options;
      const prevValue = getCellValue(row, dataIndex);
      return (
        <el-input
          ref={`text-${this.dataKey}`}
          size="small"
          value={prevValue}
          maxlength={extra.maxlength}
          onInput={val => {
            setCellValue(row, dataIndex, val);
            onInput({ [this.dataKey]: val }, row);
          }}
          onChange={val => {
            this.createFieldValidate(rules, val);
            onChange({ [this.dataKey]: val }, row);
            this.$$table.dataChangeHandle();
          }}
          nativeOnKeydown={ev => {
            if (ev.keyCode === 13) {
              onEnter({ [this.dataKey]: val }, row);
            }
          }}
          disabled={extra.disabled}
        />
      );
    },
    numberHandle(row, column) {
      const { dataIndex, precision } = column;
      const { extra = {}, rules = [], onInput = noop, onChange = noop, onEnter = noop } = this.options;
      const prevValue = getCellValue(row, dataIndex);
      const regExp = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
      return (
        <el-input
          ref={`number-${this.dataKey}`}
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
            this.createFieldValidate(rules, val);
            onChange({ [this.dataKey]: val }, row);
            this.$$table.dataChangeHandle();
          }}
          nativeOnKeydown={ev => {
            if (ev.keyCode === 13) {
              onEnter({ [this.dataKey]: val }, row);
            }
          }}
          disabled={extra.disabled}
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
            this.$$table.dataChangeHandle();
          }}
          disabled={extra.disabled}
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
          style={{ width: '100%' }}
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
            this.$$table.dataChangeHandle();
          }}
          disabled={extra.disabled}
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
            this.$$table.dataChangeHandle();
          }}
          trueValue={trueValue}
          falseValue={falseValue}
          label={text}
          disabled={disabled}
        />
      );
    },
    [`search-helperHandle`](row, column) {
      const { dataIndex } = column;
      const { extra = {}, rules = [], onClick = noop, onChange = noop } = this.options;
      const prevValue = getCellValue(row, dataIndex);
      return (
        <el-input ref={`search-helper-${this.dataKey}`} size="small" value={prevValue} readonly={true} disabled={extra.disabled}>
          <el-button
            slot="append"
            icon="el-icon-search"
            onClick={ev => {
              onClick(
                { [this.dataKey]: prevValue },
                row,
                column,
                (val, others) => {
                  setCellValue(row, dataIndex, val);
                  // 对其他单元格赋值
                  if (_.isObject(others) && Object.keys(others).length) {
                    for (let key in others) {
                      setCellValue(row, key, others[key]);
                    }
                  }
                  this.createFieldValidate(rules, val);
                  onChange({ [this.dataKey]: val }, row);
                  this.$$table.dataChangeHandle();
                },
                ev
              );
            }}
          />
        </el-input>
      );
    },
    renderEditCell() {
      const { type } = this.options;
      const render = this[`${type}Handle`];
      if (!render) {
        console.error('[Table]: 单元格编辑的类型 `type` 配置不正确');
        return null;
      }
      const { passValidate, requiredText, validateText } = this;
      const cls = [
        `v-cell--edit`,
        {
          [`is-error`]: !passValidate
        }
      ];
      return (
        <div class={cls}>
          {render(this.record, this.column)}
          {!passValidate && <div class="cell-error">{requiredText || validateText}</div>}
        </div>
      );
    },
    renderCell() {
      const { record, column } = this;
      const text = getCellValue(record, column.dataIndex);
      return <span class="v-cell--normal">{this.$$body.renderText(text, column)}</span>;
    }
  },
  render() {
    const { editable, passValidate } = this;
    return editable || !passValidate ? this.renderEditCell() : this.renderCell();
  }
};
