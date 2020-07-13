/*
 * @Author: 焦质晔
 * @Date: 2020-03-22 14:34:21
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-13 16:40:56
 */
import { isEqual, isUndefined, isFunction, isObject } from 'lodash';
import moment from 'moment';
import Locale from '../locale/mixin';
import { getCellValue, setCellValue, deepFindColumn } from '../utils';

import Checkbox from '../checkbox';
import SearchHelper from '../../../SearchHelper';
import BaseDialog from '../../../BaseDialog';

const noop = () => {};

export default {
  name: 'CellEdit',
  mixins: [Locale],
  props: ['column', 'record', 'rowKey', 'columnKey', 'clicked'],
  inject: ['$$table', '$$body'],
  data() {
    return {
      shVisible: false
    };
  },
  computed: {
    store() {
      return this.$$table.store;
    },
    options() {
      return this.column.editRender(this.record, this.column);
    },
    editable() {
      const { editable, disabled } = this.options;
      return (editable || isEqual(this.clicked, [this.rowKey, this.columnKey])) && !disabled;
    },
    size() {
      return this.$$table.tableSize !== 'mini' ? 'small' : 'mini';
    },
    dataKey() {
      return `${this.rowKey}|${this.columnKey}`;
    },
    currentKey() {
      return this.clicked.length === 2 ? `${this.clicked[0]}|${this.clicked[1]}` : '';
    },
    passValidate() {
      return ![...this.store.state.required, ...this.store.state.validate].some(({ x, y }) => x === this.rowKey && y === this.columnKey);
    },
    requiredText() {
      return this.store.state.required.find(({ x, y }) => x === this.rowKey && y === this.columnKey)?.text;
    },
    validateText() {
      return this.store.state.validate.find(({ x, y }) => x === this.rowKey && y === this.columnKey)?.text;
    }
  },
  watch: {
    clicked() {
      if (!this.editable) return;
      const { type } = this.options;
      const { currentKey } = this;
      if ((type === 'text' || type === 'number') && currentKey) {
        setTimeout(() => {
          this.$refs[`${type}-${currentKey}`]?.select();
        });
      }
    }
  },
  methods: {
    createFieldValidate(rules, val) {
      const { rowKey, columnKey } = this;
      this.$$table.createFieldValidate(rules, val, rowKey, columnKey);
    },
    textHandle(row, column) {
      const { dataIndex } = column;
      const { extra = {}, rules = [], onInput = noop, onChange = noop, onEnter = noop } = this.options;
      const prevValue = getCellValue(row, dataIndex);
      return (
        <el-input
          ref={`text-${this.dataKey}`}
          size={this.size}
          value={prevValue}
          maxlength={extra.maxlength}
          onInput={val => {
            setCellValue(row, dataIndex, val);
            this.createFieldValidate(rules, val);
            onInput({ [this.dataKey]: val }, row);
          }}
          onChange={val => {
            this.store.addToUpdated(row);
            onChange({ [this.dataKey]: val }, row);
            this.$$table.dataChangeHandle();
          }}
          nativeOnKeydown={ev => {
            if (ev.keyCode === 13) {
              onEnter({ [this.dataKey]: ev.target.value }, row);
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
          size={this.size}
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
            // 校验
            this.createFieldValidate(rules, val);
            // input 事件
            onInput({ [this.dataKey]: val }, row);
          }}
          onChange={val => {
            // 处理 val 值得特殊情况
            val = val === '-' ? '' : val;
            if (precision >= 0 && val !== '') {
              val = Number(val).toFixed(precision);
            }
            setCellValue(row, dataIndex, val);
            this.createFieldValidate(rules, val);
            this.store.addToUpdated(row);
            onChange({ [this.dataKey]: val }, row);
            this.$$table.dataChangeHandle();
          }}
          nativeOnKeydown={ev => {
            if (ev.keyCode === 13) {
              setTimeout(() => onEnter({ [this.dataKey]: ev.target.value }, row));
            }
          }}
          disabled={extra.disabled}
        />
      );
    },
    selectHandle(row, column, isMultiple) {
      const { dataIndex } = column;
      const { extra = {}, rules = [], items = [], onChange = noop } = this.options;
      const prevValue = getCellValue(row, dataIndex);
      return (
        <el-select
          size={this.size}
          multiple={isMultiple}
          value={prevValue}
          onInput={val => {
            setCellValue(row, dataIndex, val);
          }}
          placeholder={this.t('table.editable.selectPlaceholder')}
          clearable={isUndefined(extra.clearable) ? !0 : extra.clearable}
          onChange={val => {
            this.createFieldValidate(rules, val);
            this.store.addToUpdated(row);
            onChange({ [this.dataKey]: val }, row);
            this.$$table.dataChangeHandle();
          }}
          disabled={extra.disabled}
        >
          {items.map(x => (
            <el-option key={x.value} label={x.text} value={x.value} disabled={x.disabled} />
          ))}
        </el-select>
      );
    },
    [`select-multipleHandle`](row, column) {
      return this.selectHandle(row, column, !0);
    },
    dateHandle(row, column, isDateTime) {
      const { dataIndex } = column;
      const { extra = {}, rules = [], onChange = noop } = this.options;
      const prevValue = getCellValue(row, dataIndex);
      const dateFormat = !isDateTime ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss';
      return (
        <el-date-picker
          size={this.size}
          type={!isDateTime ? 'date' : 'datetime'}
          style={{ width: '100%' }}
          value={prevValue ? moment(prevValue).format(dateFormat.replace('yyyy', 'YYYY').replace('dd', 'DD')) : prevValue}
          onInput={val => {
            setCellValue(row, dataIndex, val);
          }}
          format={dateFormat}
          value-format={dateFormat}
          clearable={!1}
          placeholder={!isDateTime ? this.t('table.editable.datePlaceholder') : this.t('table.editable.datetimePlaceholder')}
          onChange={val => {
            this.createFieldValidate(rules, val);
            this.store.addToUpdated(row);
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
            this.store.addToUpdated(row);
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
      const { dataIndex, precision } = column;
      const { extra = {}, helper, rules = [], onClick = noop, onChange = noop } = this.options;
      // 设置搜索帮助的值
      const setHelperValues = (val, others) => {
        let isChange = false;
        // 对其他单元格赋值 & 校验
        if (isObject(others) && Object.keys(others).length) {
          for (let otherDataIndex in others) {
            const otherValue = others[otherDataIndex];
            const otherColumn = deepFindColumn(this.$$table.columns, otherDataIndex);
            setCellValue(row, otherDataIndex, otherValue, otherColumn?.precision);
            const otherOptions = otherColumn?.editRender?.(row, otherColumn);
            if (!Array.isArray(otherOptions?.rules)) continue;
            this.$$table.createFieldValidate(otherOptions.rules, otherValue, this.rowKey, otherDataIndex);
          }
          isChange = !0;
        }
        // 修改当前单元格的值
        if (typeof val !== 'undefined') {
          setCellValue(row, dataIndex, val, precision);
          this.createFieldValidate(rules, val);
          this.store.addToUpdated(row);
          onChange({ [this.dataKey]: val }, row);
          isChange = !0;
        }
        isChange && this.$$table.dataChangeHandle();
      };
      const dialogProps = {
        props: {
          visible: this.shVisible,
          title: this.t('table.editable.searchHelper'),
          showFullScreen: false,
          destroyOnClose: true,
          stopEventBubble: true,
          containerStyle: { height: 'calc(100% - 52px)', paddingBottom: '52px' }
        },
        on: {
          'update:visible': val => (this.shVisible = val)
        }
      };
      const shProps = {
        props: {
          ...helper
        },
        on: {
          close: (visible, data) => {
            if (isObject(data)) {
              if (!isFunction(helper.fieldAliasMap)) {
                console.error('[Table]: 单元格的搜索帮助 `fieldAliasMap` 配置不正确');
              }
              // 字段映射
              const alias = helper.fieldAliasMap();
              const result = {};
              for (let key in alias) {
                const dataKey = alias[key];
                if (key === dataIndex) continue;
                result[key] = data[dataKey];
              }
              const current = alias[dataIndex] ? data[alias[dataIndex]] : '';
              // 对表格单元格赋值
              setHelperValues(current, result);
            }
            const { closed = noop } = helper;
            closed(data);
            this.shVisible = visible;
          }
        }
      };
      const prevValue = getCellValue(row, dataIndex);
      return (
        <div class="search-helper">
          <el-input
            ref={`search-helper-${this.dataKey}`}
            size={this.size}
            value={prevValue}
            clearable
            disabled={extra.disabled}
            onClear={() => {
              setHelperValues('');
            }}
          >
            <el-button
              size={this.size}
              slot="append"
              icon="el-icon-search"
              onClick={ev => {
                if (isObject(helper)) {
                  const { open = () => true } = helper;
                  if (!open({ [this.dataKey]: prevValue }, row, column)) return;
                  this.shVisible = !0;
                } else {
                  onClick({ [this.dataKey]: prevValue }, row, column, setHelperValues, ev);
                }
              }}
            />
          </el-input>
          {isObject(helper) && (
            <BaseDialog {...dialogProps}>
              <SearchHelper {...shProps} />
            </BaseDialog>
          )}
        </div>
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
      return <span class="v-cell--text">{this.$$body.renderText(text, column, record)}</span>;
    }
  },
  render() {
    const { editable, passValidate } = this;
    return editable || !passValidate ? this.renderEditCell() : this.renderCell();
  }
};
