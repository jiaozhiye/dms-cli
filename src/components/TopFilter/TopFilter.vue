<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-14 14:30:58
 **/
import _ from 'lodash';
import moment from 'moment';
import { sleep } from '@/utils';
import pinyin, { STYLE_FIRST_LETTER } from '@/components/Pinyin/index';
import Cascader from '@/components/FormPanel/Cascader.vue';

export default {
  name: 'TopFilter',
  props: {
    list: {
      type: Array,
      required: true
    },
    initialValue: {
      type: Object,
      default: () => ({})
    },
    defaultRows: {
      type: Number,
      default: 1
    },
    cols: {
      type: Number,
      default: 3
    },
    labelWidth: {
      type: [Number, String],
      default: 80
    },
    isBtnDisabled: {
      type: Boolean,
      default: false
    },
    collapse: {
      type: Boolean,
      default: true
    },
    isSubmitBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    this.arrayTypes = ['RANGE_DATE', 'RANGE_INPUT', 'RANGE_INPUT_NUMBER', 'MULTIPLE_SELECT', 'MULTIPLE_CHECKBOX'];
    return {
      form: {},
      expand: false, // 展开收起状态
      loading: false,
      visible: {}
    };
  },
  computed: {
    formItemList() {
      const res = [];
      this.list
        .filter(x => !x.hidden && x.fieldName)
        .forEach(x => {
          if (x.type === 'BREAK_SPACE') return;
          if (_.isObject(x.labelOptions) && x.labelOptions.fieldName) {
            res.push(x.labelOptions);
          }
          res.push(x);
        });
      return res;
    },
    fieldNames() {
      return this.formItemList.map(x => x.fieldName);
    },
    rules() {
      const res = {};
      this.formItemList.forEach(x => {
        if (!x.rules) return;
        res[x.fieldName] = x.rules;
      });
      return res;
    },
    isCollapse() {
      const total = this.list.filter(x => !x.hidden).length;
      return this.collapse && total >= this.cols;
    }
  },
  watch: {
    fieldNames(nextProps, prevProps) {
      const diffRes = _.difference(nextProps, prevProps);
      if (diffRes.length) {
        diffRes.forEach(x => {
          const target = this.formItemList.find(x => x.fieldName === x);
          target && this.$set(this.form, x, this.getInitialValue(target));
        });
      }
      this.$nextTick(() => this.doClearValidate(this.$refs.form));
    },
    expand(val) {
      if (!this.isCollapse) return;
      this.$emit('onCollapse', val);
    }
  },
  created() {
    this.initialHandle();
  },
  methods: {
    initialHandle() {
      this.form = this.createFormValue();
    },
    getInitialValue(item) {
      const { type = '', fieldName } = item;
      // 初始值
      let val = this.initialValue[fieldName];
      if (this.arrayTypes.includes(type)) {
        val = val || [];
      }
      if (type === 'INPUT_TREE' && _.isUndefined(this[`${fieldName}TreeFilterTexts`])) {
        this[`${fieldName}TreeFilterTexts`] = '';
      }
      if (type === 'INPUT_CASCADER' && _.isUndefined(this[`${fieldName}CascaderTexts`])) {
        this[`${fieldName}CascaderTexts`] = '';
      }
      return val;
    },
    createFormValue() {
      const target = {};
      this.formItemList.forEach(x => {
        target[x.fieldName] = this.getInitialValue(x);
      });
      return Object.assign({}, this.initialValue, target);
    },
    createFormItemLabel(option) {
      const { form } = this;
      const { label, type = 'SELECT', fieldName, itemList, options = {}, style = {}, disabled, change = () => {} } = option;
      const { trueValue = '1', falseValue = '0' } = options;
      return (
        <div class="label-wrap" style={{ ...style }}>
          {type === 'SELECT' && (
            <el-select v-model={form[fieldName]} placeholder={''} disabled={disabled} onChange={change}>
              {itemList.map(x => (
                <el-option key={x.value} label={x.text} value={x.value} />
              ))}
            </el-select>
          )}
          {type === 'CHECKBOX' && (
            <span style="vertical-align: middle">
              <span class="desc-text" style={{ paddingRight: '10px' }}>
                {label}
              </span>
              <el-checkbox v-model={form[fieldName]} trueLabel={trueValue} falseLabel={falseValue} disabled={disabled} onChange={change} />
            </span>
          )}
        </div>
      );
    },
    createFormItemDesc(option) {
      if (!option) return null;
      const { isTooltip, style = {}, content = '描述信息...' } = option;
      if (isTooltip) {
        return (
          <el-tooltip effect="dark" content={content} placement="right">
            <i class="desc-icon el-icon-info"></i>
          </el-tooltip>
        );
      }
      return (
        <span class="desc-text" style={{ paddingLeft: '10px', ...style }}>
          {content}
        </span>
      );
    },
    RENDER_FORM_ITEM(option) {
      const { label, fieldName, labelWidth, labelOptions, style = {}, render = () => {} } = option;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <div class="desc-text" style={{ ...style }}>
            {render()}
          </div>
        </el-form-item>
      );
    },
    INPUT(option) {
      const { form } = this;
      const {
        label,
        fieldName,
        labelWidth,
        labelOptions,
        descOptions,
        style = {},
        placeholder = '请输入...',
        unitRender,
        readonly,
        disabled,
        change = () => {},
        onInput = () => {},
        onFocus = () => {}
      } = option;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-input
            v-model={form[fieldName]}
            placeholder={placeholder}
            readonly={readonly}
            disabled={disabled}
            style={{ ...style }}
            clearable
            onChange={val => {
              form[fieldName] = val.trim();
              change(form[fieldName]);
            }}
            onInput={onInput}
            onFocus={onFocus}
            nativeOnKeydown={this.enterEventHandle}
          >
            {unitRender && <template slot="append">{<div style={disabled && { pointerEvents: 'none' }}>{unitRender()}</div>}</template>}
          </el-input>
          {this.createFormItemDesc(descOptions)}
        </el-form-item>
      );
    },
    INPUT_NUMBER(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, descOptions, style = {}, placeholder = '请输入...', disabled, min = 0, max, maxlength, step = 1, precision, change = () => {} } = option;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-input-number
            v-model={form[fieldName]}
            placeholder={placeholder}
            disabled={disabled}
            style={{ ...style }}
            controls-position="right"
            min={min}
            max={max}
            step={step}
            precision={precision}
            controls={false}
            clearable
            onChange={val => {
              if (maxlength > 0 && typeof val !== 'undefined') {
                const res = Number.parseInt(val).toString();
                if (res.length > maxlength) {
                  form[fieldName] = Number(res.slice(0, maxlength));
                }
              }
              change(form[fieldName]);
            }}
            nativeOnKeydown={this.enterEventHandle}
          />
          {this.createFormItemDesc(descOptions)}
        </el-form-item>
      );
    },
    RANGE_INPUT(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, readonly, disabled, change = () => {} } = option;
      const [startFieldName, endFieldName] = fieldName.split('|');
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-input
            v-model={form[fieldName][0]}
            readonly={readonly}
            disabled={disabled}
            style={{ width: `calc(50% - 7px)` }}
            clearable
            onChange={() => change({ [startFieldName]: form[fieldName][0] })}
          />
          <span style="display: inline-block; text-align: center; width: 14px;">-</span>
          <el-input
            v-model={form[fieldName][1]}
            readonly={readonly}
            disabled={disabled}
            style={{ width: `calc(50% - 7px)` }}
            clearable
            onChange={() => change({ [endFieldName]: form[fieldName][1] })}
          />
        </el-form-item>
      );
    },
    RANGE_INPUT_NUMBER(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, min = 0, max, step = 1, precision, readonly, disabled, change = () => {} } = option;
      const [startVal, endVal] = form[fieldName];
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-input-number
            v-model={form[fieldName][0]}
            controls-position="right"
            min={min}
            max={endVal}
            step={step}
            precision={precision}
            readonly={readonly}
            disabled={disabled}
            controls={false}
            style={{ width: `calc(50% - 7px)` }}
            clearable
            onChange={() => change(form[fieldName])}
          />
          <span style="display: inline-block; text-align: center; width: 14px;">-</span>
          <el-input-number
            v-model={form[fieldName][1]}
            controls-position="right"
            min={startVal}
            max={max}
            step={step}
            precision={precision}
            readonly={readonly}
            disabled={disabled}
            controls={false}
            style={{ width: `calc(50% - 7px)` }}
            clearable
            onChange={() => change(form[fieldName])}
          />
        </el-form-item>
      );
    },
    INPUT_TREE(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, itemList, style = {}, placeholder = '请输入...', readonly, disabled, change = () => {} } = option;
      const treeWrapProps = {
        props: {
          props: { children: 'children', label: 'text' },
          data: itemList
        }
      };
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-popover
            v-model={this.visible[fieldName]}
            popper-class="input-tree"
            transition="el-zoom-in-top"
            placement="bottom-start"
            trigger="click"
            on-after-leave={() => {
              this[`${fieldName}TreeFilterTexts`] = '';
              this.treeFilterTextHandle(fieldName);
            }}
          >
            <div class="el-input--small input-tree-wrap" style={{ maxHeight: '250px', overflowY: 'auto', ...style }}>
              <input
                value={this[`${fieldName}TreeFilterTexts`]}
                class="el-input__inner"
                placeholder="树节点过滤"
                onInput={ev => {
                  this[`${fieldName}TreeFilterTexts`] = ev.target.value;
                  this.treeFilterTextHandle(fieldName);
                }}
              />
              <el-tree
                ref={`tree-${fieldName}`}
                {...treeWrapProps}
                style={{ marginTop: '4px' }}
                defaultExpandAll={true}
                expandOnClickNode={false}
                filterNodeMethod={this.filterNodeHandle}
                on-node-click={data => {
                  this.treeNodeClickHandle(fieldName, data);
                  change(this.form[fieldName]);
                }}
              />
            </div>
            <el-input
              slot="reference"
              value={this.createInputTreeValue(fieldName, itemList)}
              placeholder={placeholder}
              readonly={readonly}
              disabled={disabled}
              clearable
              style={disabled && { pointerEvents: 'none' }}
              onClear={() => {
                this.treeNodeClickHandle(fieldName, {});
                change(this.form[fieldName]);
              }}
              nativeOnKeydown={this.enterEventHandle}
            />
          </el-popover>
        </el-form-item>
      );
    },
    INPUT_CASCADER(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, itemList = [], options = {}, style = {}, placeholder = '请选择...', readonly, disabled, change = () => {} } = option;
      const { titles = [] } = options;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-popover v-model={this.visible[fieldName]} transition="el-zoom-in-top" placement="bottom-start" trigger="click">
            <div style={{ maxHeight: '250px', overflowY: 'auto', ...style }}>
              <Cascader
                value={form[fieldName]}
                onInput={val => {
                  this.cascaderChangeHandle(fieldName, val);
                }}
                list={itemList}
                labels={titles}
                style={style}
                onChange={data => {
                  change(form[fieldName], this[`${fieldName}CascaderTexts`]);
                }}
                onClose={() => (this.visible[fieldName] = false)}
              />
            </div>
            <el-input
              slot="reference"
              value={this[`${fieldName}CascaderTexts`]}
              placeholder={placeholder}
              readonly={readonly}
              disabled={disabled}
              clearable
              style={disabled && { pointerEvents: 'none' }}
              onClear={() => {
                this.cascaderChangeHandle(fieldName, []);
                change(form[fieldName], this[`${fieldName}CascaderTexts`]);
              }}
            />
          </el-popover>
        </el-form-item>
      );
    },
    SEARCH_HELPER(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, request = {}, style = {}, placeholder = '请输入...', disabled, change = () => {} } = option;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-autocomplete
            v-model={form[fieldName]}
            placeholder={placeholder}
            disabled={disabled}
            style={{ ...style }}
            clearable
            onChange={change}
            nativeOnKeydown={this.enterEventHandle}
            fetchSuggestions={(queryString, cb) => this.querySearchAsync(request, fieldName, queryString, cb)}
          />
        </el-form-item>
      );
    },
    SEARCH_HELPER_WEB(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, itemList, labelOptions, style = {}, placeholder = '请输入...', disabled, change = () => {} } = option;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-autocomplete
            v-model={form[fieldName]}
            valueKey="text"
            placeholder={placeholder}
            disabled={disabled}
            style={{ ...style }}
            clearable
            onChange={change}
            nativeOnKeydown={this.enterEventHandle}
            fetchSuggestions={(queryString, cb) => this.querySearchHandle(fieldName, queryString, cb)}
            scopedSlots={{
              default: props => {
                const { item } = props;
                return <span>{item.text}</span>;
              }
            }}
          />
        </el-form-item>
      );
    },
    SELECT(option) {
      return this.createSelectHandle(option);
    },
    MULTIPLE_SELECT(option) {
      return this.createSelectHandle(option, true);
    },
    DATE(option) {
      const { form } = this;
      const conf = {
        date: {
          placeholder: '选择日期',
          valueFormat: 'yyyy-MM-dd HH:mm:ss'
        },
        datetime: {
          placeholder: '选择时间',
          valueFormat: 'yyyy-MM-dd HH:mm:ss'
        },
        exactdate: {
          placeholder: '选择日期',
          valueFormat: 'yyyy-MM-dd'
        },
        month: {
          placeholder: '选择月份',
          valueFormat: 'yyyy-MM'
        },
        year: {
          placeholder: '选择年份',
          valueFormat: 'yyyy'
        }
      };
      const { label, fieldName, labelWidth, labelOptions, dateType = 'date', minDateTime, maxDateTime, style = {}, disabled, change = () => {} } = option;
      let currentVal;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-date-picker
            ref={fieldName}
            type={dateType.replace('exact', '')}
            value={this.formatDate(form[fieldName], conf[dateType].valueFormat)}
            onInput={val => {
              val = val === null ? undefined : val;
              form[fieldName] = val;
            }}
            value-format={conf[dateType].valueFormat}
            placeholder={conf[dateType].placeholder}
            disabled={disabled}
            style={{ ...style }}
            picker-options={{
              disabledDate: time => {
                return this.setDisabledDate(time, [minDateTime, maxDateTime]);
              }
            }}
            nativeOnInput={ev => {
              const val = ev.target.value.replace(/(\d{4})-?(\d{2})-?(\d{2})/, '$1-$2-$3');
              currentVal = val;
              ev.target.value = val;
            }}
            onBlur={val => {
              if (!currentVal) return;
              form[fieldName] = this.dateToText(currentVal);
              change(form[fieldName]);
              currentVal = undefined;
            }}
            nativeOnKeydown={ev => {
              if (ev.keyCode === 13) {
                form[fieldName] = this.dateToText(ev.target.value);
                this.$refs[fieldName].hidePicker();
              }
            }}
            onChange={() => change(form[fieldName])}
          />
        </el-form-item>
      );
    },
    // DATE_TIME -> 为了兼容旧版控件类型参数
    DATE_TIME(option) {
      return this.DATE({ ...option, dateType: 'datetime' });
    },
    RANGE_DATE(option) {
      const { form } = this;
      const conf = {
        daterange: {
          placeholder: ['开始日期', '结束日期'],
          valueFormat: 'yyyy-MM-dd HH:mm:ss'
        },
        datetimerange: {
          placeholder: ['开始时间', '结束时间'],
          valueFormat: 'yyyy-MM-dd HH:mm:ss'
        },
        exactdaterange: {
          placeholder: ['开始日期', '结束日期'],
          valueFormat: 'yyyy-MM-dd'
        },
        monthrange: {
          placeholder: ['开始月份', '结束月份'],
          valueFormat: 'yyyy-MM'
        }
      };
      const { label, fieldName, labelWidth, labelOptions, dateType = 'daterange', minDateTime, maxDateTime, style = {}, disabled, change = () => {} } = option;
      const [startDate, endDate] = form[fieldName];
      // 日期区间快捷键方法
      const createPicker = (picker, days) => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * Number(days));
        form[fieldName] = this.formatDate([start, end], conf[dateType].valueFormat);
        picker.$emit('pick', start);
      };
      const pickers = [
        {
          text: '最近一周',
          onClick(picker) {
            createPicker(picker, 7);
          }
        },
        {
          text: '最近一个月',
          onClick(picker) {
            createPicker(picker, 30);
          }
        },
        {
          text: '最近三个月',
          onClick(picker) {
            createPicker(picker, 90);
          }
        },
        {
          text: '最近六个月',
          onClick(picker) {
            createPicker(picker, 180);
          }
        }
      ];
      let startVal;
      let endVal;
      return (
        <el-form-item key={fieldName} ref={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <div class="range-date" style={{ ...style }}>
            <el-date-picker
              ref={`${fieldName}-start`}
              type={dateType.replace('exact', '').slice(0, -5)}
              value={this.formatDate(form[fieldName][0], conf[dateType].valueFormat)}
              onInput={val => {
                val = val === null ? undefined : val;
                form[fieldName] = [val, form[fieldName][1]];
              }}
              pickerOptions={{
                disabledDate: time => {
                  return this.setDisabledDate(time, [minDateTime, endDate]);
                },
                shortcuts: dateType.includes('date') ? pickers : pickers.slice(1)
              }}
              value-format={conf[dateType].valueFormat}
              style={{ width: `calc(50% - 7px)` }}
              placeholder={conf[dateType].placeholder[0]}
              disabled={disabled}
              nativeOnInput={ev => {
                const val = ev.target.value.replace(/(\d{4})-?(\d{2})-?(\d{2})/, '$1-$2-$3');
                startVal = val;
                ev.target.value = val;
              }}
              onBlur={val => {
                if (!startVal) return;
                form[fieldName] = [this.dateToText(startVal), form[fieldName][1]];
                startVal = undefined;
              }}
              nativeOnKeydown={ev => {
                if (ev.keyCode === 13) {
                  form[fieldName] = [this.dateToText(ev.target.value), form[fieldName][1]];
                  this.$refs[`${fieldName}-start`].hidePicker();
                }
              }}
              onChange={() => change(form[fieldName])}
            />
            <span class={disabled ? 'is-disabled' : ''} style="display: inline-block; line-height: 26px; text-align: center; width: 14px;">
              -
            </span>
            <el-date-picker
              ref={`${fieldName}-end`}
              type={dateType.replace('exact', '').slice(0, -5)}
              value={this.formatDate(form[fieldName][1], conf[dateType].valueFormat)}
              onInput={val => {
                val = val === null ? undefined : val;
                form[fieldName] = [form[fieldName][0], val];
              }}
              pickerOptions={{
                disabledDate: time => {
                  return this.setDisabledDate(time, [startDate, maxDateTime]);
                }
              }}
              value-format={conf[dateType].valueFormat}
              style={{ width: `calc(50% - 7px)` }}
              placeholder={conf[dateType].placeholder[1]}
              disabled={disabled}
              nativeOnInput={ev => {
                const val = ev.target.value.replace(/(\d{4})-?(\d{2})-?(\d{2})/, '$1-$2-$3');
                endVal = val;
                ev.target.value = val;
              }}
              onBlur={val => {
                if (!endVal) return;
                form[fieldName] = [form[fieldName][0], this.dateToText(endVal)];
                endVal = undefined;
              }}
              nativeOnKeydown={ev => {
                if (ev.keyCode === 13) {
                  form[fieldName] = [form[fieldName][0], this.dateToText(ev.target.value)];
                  this.$refs[`${fieldName}-end`].hidePicker();
                }
              }}
              onChange={() => change(form[fieldName])}
            />
          </div>
        </el-form-item>
      );
    },
    CHECKBOX(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, descOptions, options = {}, style = {}, disabled, change = () => {} } = option;
      const { trueValue = '1', falseValue = '0' } = options;
      form[fieldName] !== trueValue && (form[fieldName] = falseValue);
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-checkbox v-model={form[fieldName]} disabled={disabled} style={{ ...style }} trueLabel={trueValue} falseLabel={falseValue} onChange={change} />
          {this.createFormItemDesc(descOptions)}
        </el-form-item>
      );
    },
    MULTIPLE_CHECKBOX(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, descOptions, itemList, limit, style = {}, disabled, change = () => {} } = option;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-checkbox-group v-model={form[fieldName]} max={limit} style={{ ...style }} onChange={change}>
            {itemList.map(x => {
              return (
                <el-checkbox key={x.value} label={x.value} disabled={disabled}>
                  {x.text}
                </el-checkbox>
              );
            })}
          </el-checkbox-group>
          {this.createFormItemDesc(descOptions)}
        </el-form-item>
      );
    },
    RADIO(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, descOptions, itemList, style = {}, disabled, change = () => {} } = option;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-radio-group v-model={form[fieldName]} style={{ ...style }} onChange={change}>
            {itemList.map(x => (
              <el-radio key={x.value} label={x.value} disabled={disabled}>
                {x.text}
              </el-radio>
            ))}
          </el-radio-group>
          {this.createFormItemDesc(descOptions)}
        </el-form-item>
      );
    },
    TEXT_AREA(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, style = {}, placeholder = '请输入...', disabled, rows = 2, maxlength = 200 } = option;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-input
            type="textarea"
            v-model={form[fieldName]}
            placeholder={placeholder}
            disabled={disabled}
            style={{ ...style }}
            clearable
            autosize={{ minRows: rows }}
            maxlength={maxlength}
            showWordLimit
          />
        </el-form-item>
      );
    },
    createSelectHandle(option, multiple = false) {
      const { form } = this;
      const {
        label,
        fieldName,
        labelWidth,
        labelOptions,
        descOptions,
        filterable,
        request = {},
        style = {},
        placeholder = '请选择...',
        disabled,
        limit = 0,
        clearable = !0,
        change = () => {}
      } = option;
      const { fetchApi, params = {} } = request;
      let { itemList } = option;
      if (!option.itemList && fetchApi) {
        itemList = this[`${fieldName}ItemList`] || [];
        if (!_.isEqual(this[`${fieldName}PrevParams`], params)) {
          this[`${fieldName}PrevParams`] = params;
          this.querySelectOptions(request, fieldName);
        }
      }
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-select
            multiple={multiple}
            multipleLimit={limit}
            collapseTags={multiple}
            filterable={filterable}
            value={form[fieldName]}
            onInput={val => {
              if (!(multiple && filterable)) {
                form[fieldName] = val;
              } else {
                setTimeout(() => (form[fieldName] = val), 20);
              }
            }}
            placeholder={placeholder}
            disabled={disabled}
            style={{ ...style }}
            clearable={clearable}
            nativeOnKeydown={this.enterEventHandle}
            on-visible-change={visible => {
              if (filterable && !visible) {
                setTimeout(() => {
                  this.filterMethodHandle(fieldName);
                }, 300);
              }
            }}
            onChange={val => {
              const { text } = itemList.find(x => x.value === val) || {};
              change(val, !multiple ? text : undefined);
              if (!filterable) return;
              this.filterMethodHandle(fieldName, '');
            }}
            filterMethod={queryString => {
              if (!filterable) return;
              this.filterMethodHandle(fieldName, queryString);
            }}
          >
            {itemList.map(x => (
              <el-option key={x.value} label={x.text} value={x.value} disabled={x.disabled} />
            ))}
          </el-select>
          {this.createFormItemDesc(descOptions)}
        </el-form-item>
      );
    },
    // 设置日期控件的禁用状态
    setDisabledDate(time, [minDateTime, maxDateTime]) {
      const min = minDateTime
        ? moment(minDateTime)
            .toDate()
            .getTime()
        : 0;
      const max = maxDateTime
        ? moment(maxDateTime)
            .toDate()
            .getTime()
        : 0;
      if (min && max) {
        return !(time.getTime() > min && time.getTime() < max);
      }
      if (!!min) {
        return time.getTime() < min;
      }
      if (!!max) {
        return time.getTime() > max;
      }
      return false;
    },
    // 下拉框的筛选方法
    filterMethodHandle(fieldName, queryString = '') {
      const target = this.formItemList.find(x => x.fieldName === fieldName);
      const itemList = target.itemList || this[`${fieldName}ItemList`] || [];
      if (!this[`${fieldName}OriginItemList`]) {
        this[`${fieldName}OriginItemList`] = itemList;
      }
      const res = queryString ? this[`${fieldName}OriginItemList`].filter(this.createSearchHelpFilter(queryString)) : this[`${fieldName}OriginItemList`];
      if (!this[`${fieldName}ItemList`]) {
        target.itemList = res;
      } else {
        this[`${fieldName}ItemList`] = res;
        this.$forceUpdate();
      }
    },
    // 获取下拉框数据
    async querySelectOptions({ fetchApi, params = {}, datakey = '', valueKey = 'value', textKey = 'text' }, fieldName) {
      if (process.env.MOCK_DATA === 'true') {
        const res = require('@/mock/sHelperData').default;
        this[`${fieldName}ItemList`] = res.data.map(x => ({ value: x[valueKey], text: x[textKey] }));
      } else {
        const res = await fetchApi(params);
        if (res.resultCode === 200) {
          const dataList = !datakey ? res.data : _.get(res.data, datakey, []);
          this[`${fieldName}ItemList`] = dataList.map(x => ({ value: x[valueKey], text: x[textKey] }));
        }
      }
      this.$forceUpdate();
    },
    // 获取搜索帮助数据
    async querySearchAsync(request, fieldName, queryString = '', cb) {
      const { fetchApi, params = {}, datakey = '', valueKey } = request;
      if (process.env.MOCK_DATA === 'true') {
        const res = require('@/mock/sHelperData').default;
        setTimeout(() => {
          cb(this.createSerachHelperList(res.data, valueKey));
        }, 500);
      } else {
        const res = await fetchApi({ ...{ [fieldName]: queryString }, ...params });
        if (res.resultCode === 200) {
          const dataList = !datakey ? res.data : _.get(res.data, datakey, []);
          cb(this.createSerachHelperList(dataList, valueKey));
        }
      }
    },
    // 创建搜索帮助数据列表
    createSerachHelperList(list, valueKey) {
      return list.map(x => ({ value: x[valueKey] }));
    },
    querySearchHandle(fieldName, queryString = '', cb) {
      const { itemList = [] } = this.formItemList.find(x => x.fieldName === fieldName) || {};
      const res = queryString ? itemList.filter(this.createSearchHelpFilter(queryString)) : itemList;
      cb(res);
    },
    createSearchHelpFilter(queryString) {
      return state => {
        const pyt = pinyin(state.text, { style: STYLE_FIRST_LETTER })
          .flat()
          .join('');
        const str = `${state.text}|${pyt}`;
        return str.toLowerCase().includes(queryString.toLowerCase());
      };
    },
    // 创建树节点的值
    createInputTreeValue(fieldName, itemList) {
      let { text = '' } = this.deepFind(itemList, this.form[fieldName]) || {};
      return text;
    },
    // 树控件顶部文本帅选方法
    treeFilterTextHandle(key) {
      this.$refs[`tree-${key}`].filter(this[`${key}TreeFilterTexts`]);
    },
    // 树结构的筛选方法
    filterNodeHandle(value, data) {
      if (!value) return true;
      return data.text.indexOf(value) !== -1;
    },
    // 树节点单机事件
    treeNodeClickHandle(fieldName, { value, disabled }) {
      if (disabled) return;
      this.form[fieldName] = value;
      this.visible[fieldName] = false;
    },
    // 级联选择器值变化处理方法
    cascaderChangeHandle(fieldName, data) {
      this.form[fieldName] = data.map(x => x.value).join(',') || undefined;
      this[`${fieldName}CascaderTexts`] = data.map(x => x.text).join('/');
      // 强制重新渲染组件
      this.$forceUpdate();
    },
    createFormItem() {
      return this.list
        .filter(x => !x.hidden)
        .map(item => {
          const VNode = !this[item.type] ? null : item.render ? this.RENDER_FORM_ITEM(item) : this[item.type](item);
          VNode['type'] = item.type;
          return VNode;
        });
    },
    enterEventHandle(ev) {
      if (ev.keyCode !== 13) return;
      this.submitForm(ev);
    },
    async loadingHandler() {
      this.loading = true;
      await sleep(300);
      this.loading = false;
    },
    isValidateValue(val) {
      return Array.isArray(val) ? val.length : !!val;
    },
    // 表单数据是否通过非空校验
    isPassValidate(form) {
      for (let key in this.rules) {
        if (this.rules[key].some(x => x.required) && !this.isValidateValue(form[key])) {
          return false;
        }
      }
      return true;
    },
    doClearValidate($ref) {
      $ref && $ref.clearValidate();
    },
    doFormItemValidate(fieldName) {
      this.$refs.form.validateField(fieldName);
    },
    excuteFormData(form) {
      this.formItemList
        .filter(x => ['RANGE_DATE', 'RANGE_INPUT_NUMBER'].includes(x.type))
        .map(x => x.fieldName)
        .forEach(fieldName => {
          if (form[fieldName].length > 0) {
            // 处理可能出现的风险 bug
            form[fieldName] = Object.assign([], [undefined, undefined], form[fieldName]);
            if (form[fieldName].every(x => _.isUndefined(x))) {
              form[fieldName] = [];
            }
            if (form[fieldName].some(x => _.isUndefined(x))) {
              let val = form[fieldName].find(x => !_.isUndefined(x));
              form[fieldName] = [val, val];
            }
          }
        });
      for (let attr in form) {
        if (attr.includes('|') && Array.isArray(form[attr])) {
          let [start, end] = attr.split('|');
          form[start] = form[attr][0];
          form[end] = form[attr][1];
        }
      }
    },
    submitForm(ev) {
      ev && ev.preventDefault();
      let isErr;
      this.excuteFormData(this.form);
      this.$refs.form.validate(valid => {
        isErr = !valid;
        if (valid) {
          this.loadingHandler();
          return this.$emit('filterChange', this.form);
        }
        // 校验没通过，展开
        this.expand = true;
      });
      return isErr;
    },
    resetForm() {
      let cloneForm = _.cloneDeep(this.form);
      // 重置表单项
      this.$refs.form.resetFields();
      this.formItemList.forEach(x => {
        if (x.noResetable) {
          this.form[x.fieldName] = cloneForm[x.fieldName];
        }
      });
      this.excuteFormData(this.form);
      this.isPassValidate(this.form) && this.$emit('filterChange', this.form);
      this.$emit('resetChange', this.form);
      // 清空变量，释放内存
      cloneForm = null;
      // 解决日期区间(拆分后)重复校验的 bug
      this.$nextTick(() => {
        this.formItemList.forEach(x => {
          if (x.type === 'RANGE_DATE') {
            this.doClearValidate(this.$refs[x.fieldName]);
          }
        });
      });
    },
    toggleHandler() {
      this.expand = !this.expand;
    },
    createButton(rows, total) {
      const { cols, expand, isCollapse, loading, isBtnDisabled } = this;
      const colSpan = 24 / cols;
      // 默认收起
      let offset = rows * cols - total > 0 ? rows * cols - total - 1 : 0;
      // 展开
      if (!isCollapse || expand) {
        offset = cols - (total % cols) - 1;
      }
      return this.isSubmitBtn ? (
        <el-col key="-" span={colSpan} offset={offset * colSpan} style={{ textAlign: 'right' }}>
          <el-button size="small" type="primary" loading={loading} disabled={isBtnDisabled} onClick={this.submitForm}>
            搜 索
          </el-button>
          <el-button size="small" disabled={isBtnDisabled} onClick={this.resetForm}>
            重 置
          </el-button>
          {isCollapse ? (
            <el-button size="small" type="text" onClick={this.toggleHandler}>
              {expand ? '收起' : '展开'} <i class={expand ? 'el-icon-arrow-up' : 'el-icon-arrow-down'} />
            </el-button>
          ) : null}
        </el-col>
      ) : null;
    },
    createFormLayout() {
      const unfixTypes = ['TEXT_AREA'];
      const { cols, defaultRows, expand, isCollapse } = this;
      const colSpan = 24 / cols;
      const formItems = this.createFormItem().filter(item => item !== null);
      const defaultPlayRows = defaultRows > Math.ceil(formItems.length / cols) ? Math.ceil(formItems.length / cols) : defaultRows;
      const count = expand ? formItems.length : defaultPlayRows * cols - 1;
      const colFormItems = formItems.map((Node, i) => {
        return (
          <el-col key={i} type={unfixTypes.includes(Node.type) ? 'UN_FIXED' : 'FIXED'} span={colSpan} style={{ display: !isCollapse || i < count ? 'block' : 'none' }}>
            {Node}
          </el-col>
        );
      });
      return [...colFormItems, this.createButton(defaultPlayRows, formItems.length)];
    },
    dateToText(input = '') {
      const res = moment(input, 'YYYYMMDD').format('YYYY-MM-DD');
      return res !== 'Invalid date' ? res : '';
    },
    // 日期格式化
    formatDate(val, vf) {
      const arr = Array.isArray(val) ? val : [val];
      const res = arr.map(x => {
        return !x ? x : moment(x).format(vf.replace('yyyy', 'YYYY').replace('dd', 'DD'));
      });
      return Array.isArray(val) ? res : res[0];
    },
    deepFind(arr, mark) {
      let res = null;
      for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i].children)) {
          res = this.deepFind(arr[i].children, mark);
        }
        if (res) {
          return res;
        }
        if (arr[i].value === mark) {
          return arr[i];
        }
      }
      return res;
    },
    // 外部通过组件实例调用的方法
    SUBMIT_FORM() {
      const err = this.submitForm();
      return !err ? this.form : null;
    },
    RESET_FORM() {
      this.resetForm();
    },
    // 设置表单项的值，参数是表单值得集合 { fieldName: val, ... }
    SET_FIELDS_VALUE(values = {}) {
      for (let key in values) {
        if (this.fieldNames.includes(key)) {
          this.form[key] = values[key];
        }
      }
    },
    async GET_FORM_DATA() {
      try {
        this.excuteFormData(this.form);
        await this.$refs.form.validate();
        return [false, this.form];
      } catch (err) {
        return [true, null];
      }
    }
  },
  render() {
    const { form, rules, labelWidth } = this;
    const wrapProps = {
      props: {
        size: 'small',
        model: form,
        rules,
        labelWidth: `${labelWidth}px`
      },
      nativeOn: {
        submit: ev => ev.preventDefault()
      }
    };
    return (
      <div class="top-filter">
        <el-form ref="form" {...wrapProps}>
          <el-row gutter={10}>{this.createFormLayout()}</el-row>
        </el-form>
      </div>
    );
  }
};
</script>

<style lang="less">
.top-filter {
  .el-col {
    min-height: 32px;
    margin-bottom: 12px;
    &[type='FIXED'] {
      height: 32px !important;
    }
    .el-form-item {
      margin-bottom: 0;
      .el-form-item__label {
        height: 32px;
        font-size: @textSizeSecondary;
        padding-right: @modulePadding;
        .label-wrap {
          display: inline-block;
          max-width: calc(100% - 10px);
          .el-input__inner {
            border-color: @borderColor;
            padding: 0 8px;
            & + span.el-input__suffix {
              right: 0;
            }
          }
        }
      }
      .el-form-item__content {
        .el-form-item__error {
          margin-top: -2px;
          transform-origin: 0 50%;
          -webkit-transform: scale(0.9);
          transform: scale(0.9);
        }
      }
      .el-select {
        width: 100%;
      }
      .el-autocomplete {
        width: 100%;
      }
      .el-date-editor {
        width: 100%;
      }
      .range-date {
        display: flex;
        border: 1px solid @borderColor;
        border-radius: @borderRadius;
        .el-date-editor {
          input {
            border: 0 !important;
            height: 30px;
            padding-right: 0;
          }
          &:nth-of-type(1) {
            input {
              padding-left: 30px;
            }
            .el-input__suffix {
              right: -5px;
            }
          }
          &:nth-of-type(2) {
            input {
              padding-left: 25px;
            }
            .el-input__prefix {
              left: 0;
            }
            .el-input__suffix {
              right: 0;
            }
          }
        }
        .is-disabled {
          background-color: @backgroundColor;
          color: @disabledColor;
          cursor: not-allowed;
        }
      }
      .el-textarea {
        display: block;
        .el-textarea__inner {
          font-family: inherit;
          overflow-y: auto;
        }
        .el-input__count {
          line-height: 1;
          right: 6px;
        }
      }
      .el-input-number {
        width: 100%;
        .el-input__inner {
          text-align: left !important;
        }
        .el-input-number__increase:hover ~ .el-input .el-input__inner:not(.is-disabled),
        .el-input-number__decrease:hover ~ .el-input .el-input__inner:not(.is-disabled) {
          border-color: @borderColor;
        }
      }
      .el-range-editor {
        padding-right: 5px;
        .el-range-separator {
          padding-left: 0;
          padding-right: 0;
        }
        .el-range__close-icon {
          width: 20px;
        }
      }
      .desc-icon {
        padding: 6px;
        font-size: 18px;
        vertical-align: middle;
      }
      .desc-text {
        font-size: @textSizeSecondary;
      }
      &.is-error {
        .range-date {
          border-color: #f5222d;
        }
      }
    }
  }
}
.input-tree {
  .input-tree-wrap {
    padding-right: 10px;
    margin-right: -10px;
  }
  .el-tree {
    .el-tree-node[aria-disabled='true'] > .el-tree-node__content {
      color: @disabledColor;
      background: none;
      cursor: not-allowed;
      .is-leaf {
        pointer-events: none;
      }
    }
  }
}
</style>
