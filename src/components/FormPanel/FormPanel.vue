<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-14 17:20:16
 **/
import _ from 'lodash';
import moment from 'moment';
import { sleep } from '@/utils';
import pinyin, { STYLE_FIRST_LETTER } from '@/components/Pinyin/index';
import Cascader from './Cascader.vue';
import BreakSpace from '@/components/BreakSpace/BreakSpace.vue';
import UploadFile from '@/components/UploadFile/UploadFile.vue';
import UploadCropper from '@/components/UploadCropper/UploadCropper.vue';
import Tinymce from '@/components/Tinymce/Tinymce.vue';

const noop = () => {};

export default {
  name: 'FormPanel',
  props: {
    list: {
      type: Array,
      required: true
    },
    initialValue: {
      type: Object,
      default: () => ({})
    },
    formType: {
      type: String,
      default: 'default'
    },
    cols: {
      type: Number,
      default: 3
    },
    labelWidth: {
      type: [Number, String],
      default: 80
    },
    isSubmitBtn: {
      type: Boolean,
      default: false
    },
    scrollContainer: {
      default: null
    }
  },
  data() {
    this.arrayTypes = ['RANGE_DATE', 'RANGE_TIME', 'RANGE_TIME_SELECT', 'RANGE_INPUT', 'RANGE_INPUT_NUMBER', 'MULTIPLE_SELECT', 'MULTIPLE_CHECKBOX', 'UPLOAD_IMG', 'UPLOAD_FILE'];
    return {
      form: {},
      visible: {},
      loading: false
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
      const { type = '', fieldName, options = {}, readonly } = item;
      // 初始值
      let val = this.initialValue[fieldName];
      if (this.formType === 'onlyShow') {
        item.disabled = true;
      }
      if (this.arrayTypes.includes(type)) {
        val = val || [];
      }
      if (type === 'INPUT' && (readonly || item.disabled)) {
        const { secretType } = options;
        if (!!secretType) {
          val = this.secretFormat(val, secretType);
        }
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
      const { label, type = 'SELECT', fieldName, options = {}, trueValue = '1', falseValue = '0', style = {}, disabled, onChange = noop } = option;
      const { itemList } = options;
      return (
        <div class="label-wrap" style={{ ...style }}>
          {type === 'SELECT' && (
            <el-select v-model={form[fieldName]} placeholder={''} disabled={disabled} onChange={onChange}>
              {itemList.map(x => (
                <el-option key={x.value} label={x.text} value={x.value} />
              ))}
            </el-select>
          )}
          {type === 'CHECKBOX' && (
            <span>
              <span class="desc-text" style={{ paddingRight: '10px' }}>
                {label}
              </span>
              <el-checkbox v-model={form[fieldName]} trueLabel={trueValue} falseLabel={falseValue} disabled={disabled} onChange={onChange} />
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
          <el-tooltip effect="dark" placement="right">
            <div slot="content">{content}</div>
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
      const { label, fieldName, labelWidth, labelOptions, style = {}, render = noop } = option;
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
      const { label, fieldName, labelWidth, labelOptions, descOptions, options = {}, style = {}, placeholder = '请输入...', readonly, disabled, onChange = noop } = option;
      const { minlength = 0, maxlength, pattern, unitRender, onInput = noop, onEnter = noop, onFocus = noop } = options;
      const prevValue = form[fieldName];
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-input
            value={prevValue}
            onInput={val => {
              if (_.isRegExp(pattern)) {
                // 是否为删除动作
                const isRemoveHandle = val.length < (prevValue && prevValue.length);
                // 单元格正则校验
                if (!isRemoveHandle && !pattern.test(val)) return;
              }
              form[fieldName] = val;
              onInput(val);
            }}
            minlength={minlength}
            maxlength={maxlength}
            placeholder={!disabled ? placeholder : ''}
            readonly={readonly}
            disabled={disabled}
            style={{ ...style }}
            clearable
            onChange={val => {
              form[fieldName] = val.trim();
              onChange(form[fieldName]);
            }}
            onFocus={onFocus}
            nativeOnKeydown={e => {
              if (e.keyCode !== 13) return;
              onEnter(e.target.value);
              this.doFormItemValidate(fieldName);
            }}
          >
            {unitRender && <template slot="append">{<div style={disabled && { pointerEvents: 'none' }}>{unitRender()}</div>}</template>}
          </el-input>
          {this.createFormItemDesc(descOptions)}
        </el-form-item>
      );
    },
    INPUT_NUMBER(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, descOptions, options = {}, style = {}, placeholder = '请输入...', disabled, onChange = noop } = option;
      const { maxlength, min = 0, max, step = 1, precision } = options;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-input-number
            v-model={form[fieldName]}
            placeholder={!disabled ? placeholder : ''}
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
              onChange(form[fieldName]);
            }}
          />
          {this.createFormItemDesc(descOptions)}
        </el-form-item>
      );
    },
    RANGE_INPUT(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, readonly, disabled, onChange = noop } = option;
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
            onChange={() => onChange({ [startFieldName]: form[fieldName][0] })}
          />
          <span style="display: inline-block; text-align: center; width: 14px;">-</span>
          <el-input
            v-model={form[fieldName][1]}
            readonly={readonly}
            disabled={disabled}
            style={{ width: `calc(50% - 7px)` }}
            clearable
            onChange={() => onChange({ [endFieldName]: form[fieldName][1] })}
          />
        </el-form-item>
      );
    },
    RANGE_INPUT_NUMBER(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, options = {}, readonly, disabled, onChange = noop } = option;
      const { min = 0, max, step = 1, precision } = options;
      const [startVal = min, endVal = max] = form[fieldName];
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
            onChange={() => onChange(form[fieldName])}
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
            onChange={() => onChange(form[fieldName])}
          />
        </el-form-item>
      );
    },
    INPUT_TREE(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, options = {}, style = {}, placeholder = '请输入...', readonly, disabled, onChange = noop } = option;
      const { itemList } = options;
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
                  onChange(this.form[fieldName]);
                }}
              />
            </div>
            <el-input
              slot="reference"
              value={this.createInputTreeValue(fieldName, itemList)}
              placeholder={!disabled ? placeholder : ''}
              readonly={readonly}
              disabled={disabled}
              clearable
              style={disabled && { pointerEvents: 'none' }}
              onClear={() => {
                this.treeNodeClickHandle(fieldName, {});
                onChange(this.form[fieldName]);
              }}
            />
          </el-popover>
        </el-form-item>
      );
    },
    INPUT_CASCADER(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, options = {}, style = {}, placeholder = '请选择...', readonly, disabled, onChange = noop } = option;
      const { itemList, titles = [] } = options;
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
                  onChange(form[fieldName], this[`${fieldName}CascaderTexts`]);
                }}
                onClose={() => (this.visible[fieldName] = false)}
              />
            </div>
            <el-input
              slot="reference"
              value={this[`${fieldName}CascaderTexts`]}
              placeholder={!disabled ? placeholder : ''}
              readonly={readonly}
              disabled={disabled}
              clearable
              style={disabled && { pointerEvents: 'none' }}
              onClear={() => {
                this.cascaderChangeHandle(fieldName, []);
                onChange(form[fieldName], this[`${fieldName}CascaderTexts`]);
              }}
            />
          </el-popover>
        </el-form-item>
      );
    },
    SEARCH_HELPER(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, request = {}, style = {}, placeholder = '请输入...', disabled, onChange = noop } = option;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-autocomplete
            v-model={form[fieldName]}
            placeholder={!disabled ? placeholder : ''}
            disabled={disabled}
            style={{ ...style }}
            clearable
            onChange={onChange}
            fetchSuggestions={(queryString, cb) => this.querySearchAsync(request, fieldName, queryString, cb)}
          />
        </el-form-item>
      );
    },
    SEARCH_HELPER_WEB(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, options = {}, labelOptions, style = {}, placeholder = '请输入...', disabled, onChange = noop } = option;
      const { itemList } = options;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-autocomplete
            v-model={form[fieldName]}
            valueKey="text"
            placeholder={!disabled ? placeholder : ''}
            disabled={disabled}
            style={{ ...style }}
            clearable
            onChange={onChange}
            fetchSuggestions={(queryString, cb) => this.querySearchHandle(fieldName, itemList, queryString, cb)}
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
      const { label, fieldName, labelWidth, labelOptions, options = {}, style = {}, disabled, onChange = noop } = option;
      const { dateType = 'date', minDateTime, maxDateTime, defaultTime } = options;
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
            default-time={defaultTime}
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
              onChange(form[fieldName]);
              currentVal = undefined;
            }}
            nativeOnKeydown={ev => {
              if (ev.keyCode === 13) {
                form[fieldName] = this.dateToText(ev.target.value);
                this.$refs[`${fieldName}`].hidePicker();
              }
            }}
            onChange={() => onChange(form[fieldName])}
          />
        </el-form-item>
      );
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
      const { label, fieldName, labelWidth, labelOptions, options = {}, style = {}, disabled, onChange = noop } = option;
      const { dateType = 'daterange', minDateTime, maxDateTime } = options;
      // 日期区间快捷键方法
      const createPicker = (picker, days) => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * Number(days));
        picker.$emit('pick', [start, end]);
      };
      // 获取 input 节点的索引
      const getInputIndex = (fieldName, el) => {
        const $inputEls = [...this.$refs[fieldName].$el.querySelectorAll('.el-range-input')];
        return $inputEls.findIndex(x => x === el);
      };
      // 设置日期区间数据的值
      const setDateRangeValue = () => {
        for (let i = 0; i < 2; i++) {
          form[fieldName][i] = this.dateToText(form[fieldName][i]) || '';
        }
        form[fieldName] = [...form[fieldName]];
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
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-date-picker
            ref={fieldName}
            type={dateType.replace('exact', '')}
            value={this.formatDate(form[fieldName], conf[dateType].valueFormat)}
            onInput={val => {
              val = val === null ? [] : val;
              form[fieldName] = val;
            }}
            value-format={conf[dateType].valueFormat}
            range-separator="-"
            start-placeholder={conf[dateType].placeholder[0]}
            end-placeholder={conf[dateType].placeholder[1]}
            unlink-panels={true}
            disabled={disabled}
            style={{ ...style }}
            pickerOptions={{
              shortcuts: dateType.includes('date') ? pickers : pickers.slice(1),
              disabledDate: time => {
                return this.setDisabledDate(time, [minDateTime, maxDateTime]);
              }
            }}
            nativeOnInput={ev => {
              const v = getInputIndex(fieldName, ev.target);
              const val = ev.target.value.replace(/(\d{4})-?(\d{2})-?(\d{2})/, '$1-$2-$3');
              form[fieldName][v] = val;
            }}
            onBlur={val => {
              setDateRangeValue();
            }}
            nativeOnKeydown={ev => {
              if (ev.keyCode === 13) {
                setDateRangeValue();
                getInputIndex(fieldName, ev.target) && this.$refs[`${fieldName}`].hidePicker();
              }
            }}
            onChange={() => onChange(form[fieldName])}
          />
        </el-form-item>
      );
    },
    TIME(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, options = {}, valueFormat = 'HH:mm:ss', style = {}, placeholder = '选择时间', disabled, onChange = noop } = option;
      const { defaultTime } = options;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-time-picker
            v-model={form[fieldName]}
            pickerOptions={{
              format: valueFormat
            }}
            default-value={defaultTime}
            value-format={valueFormat}
            placeholder={!disabled ? placeholder : ''}
            disabled={disabled}
            style={{ ...style }}
            onChange={onChange}
          />
        </el-form-item>
      );
    },
    RANGE_TIME(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, valueFormat = 'HH:mm:ss', style = {}, disabled, onChange = noop } = option;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-time-picker
            isRange={true}
            value={form[fieldName].length ? form[fieldName] : undefined}
            onInput={val => {
              val = val === null ? [] : val;
              form[fieldName] = val;
            }}
            value-format={valueFormat}
            range-separator="-"
            start-placeholder={'开始时间'}
            end-placeholder={'结束时间'}
            disabled={disabled}
            style={{ ...style }}
            onChange={() => onChange(form[fieldName])}
          />
        </el-form-item>
      );
    },
    TIME_SELECT(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, options = {}, valueFormat = 'HH:mm', style = {}, placeholder = '选择时间', disabled, onChange = noop } = option;
      const { defaultTime, startTime = '00:00', endTime = '23:45', stepTime = '00:15' } = options;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-time-select
            v-model={form[fieldName]}
            pickerOptions={{
              start: startTime,
              end: endTime,
              step: stepTime
            }}
            default-value={defaultTime}
            value-format={valueFormat}
            placeholder={!disabled ? placeholder : ''}
            disabled={disabled}
            style={{ ...style }}
            onChange={onChange}
          />
        </el-form-item>
      );
    },
    RANGE_TIME_SELECT(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, options = {}, valueFormat = 'HH:mm', style = {}, disabled, onChange = noop } = option;
      const { startTime = '00:00', endTime = '23:45', stepTime = '00:15' } = options;
      const stepMinute = moment(stepTime, valueFormat).minute();
      const [startVal, endVal] = form[fieldName];
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-time-select
            value={form[fieldName][0]}
            onInput={val => {
              val = val === null ? undefined : val;
              form[fieldName] = [val, endVal];
            }}
            pickerOptions={{
              start: startTime,
              end: endTime,
              step: stepTime,
              maxTime:
                endVal &&
                moment(endVal, valueFormat)
                  .add(stepMinute, 'minutes')
                  .format(valueFormat)
            }}
            value-format={valueFormat}
            placeholder={'开始时间'}
            disabled={disabled}
            style={{ width: `calc(50% - 7px)` }}
            onChange={() => onChange(form[fieldName])}
          />
          <span style="display: inline-block; text-align: center; width: 14px;">-</span>
          <el-time-select
            value={form[fieldName][1]}
            onInput={val => {
              val = val === null ? undefined : val;
              form[fieldName] = [startVal, val];
            }}
            pickerOptions={{
              start: startTime,
              end: endTime,
              step: stepTime,
              minTime:
                startVal &&
                moment(startVal, valueFormat)
                  .subtract(stepMinute, 'minutes')
                  .format(valueFormat)
            }}
            value-format={valueFormat}
            placeholder={'结束时间'}
            disabled={disabled}
            style={{ width: `calc(50% - 7px)` }}
            onChange={() => onChange(form[fieldName])}
          />
        </el-form-item>
      );
    },
    CHECKBOX(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, descOptions, trueValue = '1', falseValue = '0', style = {}, disabled, onChange = noop } = option;
      form[fieldName] !== trueValue && (form[fieldName] = falseValue);
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-checkbox v-model={form[fieldName]} disabled={disabled} style={{ ...style }} trueLabel={trueValue} falseLabel={falseValue} onChange={onChange} />
          {this.createFormItemDesc(descOptions)}
        </el-form-item>
      );
    },
    MULTIPLE_CHECKBOX(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, descOptions, options = {}, style = {}, disabled, onChange = noop } = option;
      const { itemList, limit } = options;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-checkbox-group v-model={form[fieldName]} max={limit} style={{ ...style }} onChange={onChange}>
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
      const { label, fieldName, labelWidth, labelOptions, descOptions, options, style = {}, disabled, onChange = noop } = option;
      const { itemList } = options;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-radio-group v-model={form[fieldName]} style={{ ...style }} onChange={onChange}>
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
      const { label, fieldName, labelWidth, labelOptions, options = {}, style = {}, placeholder = '请输入...', disabled, onChange = noop } = option;
      const { rows = 2, maxlength = 200 } = options;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-input
            type="textarea"
            v-model={form[fieldName]}
            placeholder={!disabled ? placeholder : ''}
            disabled={disabled}
            style={{ ...style }}
            clearable
            autosize={{ minRows: rows }}
            maxlength={maxlength}
            showWordLimit
            onChange={onChange}
          />
        </el-form-item>
      );
    },
    UPLOAD_IMG(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, upload = {}, style = {}, disabled, onChange = noop } = option;
      return (
        <el-form-item key={fieldName} ref={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <UploadCropper
            actionUrl={upload.actionUrl}
            initialValue={form[fieldName]}
            style={{ ...style }}
            fixedSize={upload.fixedSize}
            isCalcHeight={upload.isCalcHeight}
            limit={upload.limit || 1}
            params={upload.params}
            titles={upload.titles}
            tipText={upload.tipText}
            disabled={disabled}
            onChange={val => {
              this.fileChangeHandle(fieldName, val);
              onChange(val);
            }}
          />
        </el-form-item>
      );
    },
    UPLOAD_FILE(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, upload = {}, style = {}, disabled, onChange = noop } = option;
      return (
        <el-form-item key={fieldName} ref={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <UploadFile
            actionUrl={upload.actionUrl}
            initialValue={form[fieldName]}
            fileTypes={upload.fileTypes}
            fileSize={upload.fileSize}
            limit={upload.limit || 1}
            params={upload.params}
            disabled={disabled}
            style={{ ...style }}
            onChange={val => {
              this.fileChangeHandle(fieldName, val);
              onChange(val);
            }}
          >
            文件上传
          </UploadFile>
        </el-form-item>
      );
    },
    TINYMCE(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, height, upload = {}, disabled, onChange = noop } = option;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <Tinymce v-model={form[fieldName]} actionUrl={upload.actionUrl} height={height} fixedSize={upload.fixedSize} disabled={disabled} onChange={onChange} />
        </el-form-item>
      );
    },
    BREAK_SPACE(option) {
      const { label = '标题', style = {} } = option;
      return <BreakSpace label={label} id={label} labelStyle={style} />;
    },
    createSelectHandle(option, multiple = false) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, descOptions, options = {}, request = {}, style = {}, placeholder = '请选择...', disabled, clearable = !0, onChange = noop } = option;
      const { filterable, limit } = options;
      const { fetchApi, params = {} } = request;
      let itemList = options.itemList;
      if (!itemList && fetchApi) {
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
            filterable={filterable}
            value={form[fieldName]}
            onInput={val => {
              if (!(multiple && filterable)) {
                form[fieldName] = val;
              } else {
                setTimeout(() => (form[fieldName] = val), 20);
              }
            }}
            placeholder={!disabled ? placeholder : ''}
            disabled={disabled}
            style={{ ...style }}
            clearable={clearable}
            on-visible-change={visible => {
              if (filterable && !visible) {
                setTimeout(() => {
                  this.filterMethodHandle(fieldName);
                }, 300);
              }
            }}
            onChange={val => {
              const { text } = itemList.find(x => x.value === val) || {};
              onChange(val, !multiple ? text : undefined);
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
        return !(time.getTime() >= min && time.getTime() <= max);
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
      const { fetchApi, params = {}, datakey = '', valueKey = 'value' } = request;
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
    querySearchHandle(fieldName, itemList = [], queryString = '', cb) {
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
    // 文件上传的 change 事件
    fileChangeHandle(fieldName, val) {
      this.form[fieldName] = val;
      this.doFormItemValidate(fieldName);
    },
    async loadingHandler() {
      this.loading = true;
      await sleep(300);
      this.loading = false;
    },
    createFormItem() {
      return this.list
        .filter(x => !x.hidden)
        .map(item => {
          const VNode = !this[item.type] ? null : item.render ? this.RENDER_FORM_ITEM(item) : this[item.type](item);
          VNode['type'] = item.type;
          VNode['fieldName'] = item.fieldName;
          VNode['cols'] = item.selfCols;
          VNode['offsetLeft'] = item.offsetLeftCols;
          VNode['offsetRight'] = item.offsetRightCols;
          return VNode;
        });
    },
    doClearValidate($ref) {
      $ref && $ref.clearValidate();
    },
    doFormItemValidate(fieldName) {
      this.$refs.form.validateField(fieldName);
    },
    excuteFormData(form) {
      this.formItemList
        .filter(x => ['RANGE_INPUT_NUMBER', 'RANGE_TIME_SELECT'].includes(x.type))
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
    // 计算目标元素相对于滚动容器的上边距
    calcOffsetTop(_id) {
      let $target = document.getElementById(`fp-${_id}`);
      let top = $target.offsetTop;
      let $parent = $target.offsetParent;
      while ($parent !== null && $parent !== this.scrollContainer) {
        top += $parent.offsetTop;
        $parent = $parent.offsetParent;
      }
      return top;
    },
    // 锚点定位没有通过校验的表单项
    createAnchorFixed(ids) {
      const res = [];
      for (let key in ids) {
        res.push({ fieldName: key, disY: this.calcOffsetTop(key) });
      }
      res.sort((a, b) => a.disY - b.disY);
      this.scrollContainer.scrollTop = res[0].disY || 0;
    },
    // 获取表单组件的值
    getFormData() {
      this.excuteFormData(this.form);
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid, fields) => {
          if (!valid) {
            reject(fields);
          } else {
            resolve(this.form);
          }
        });
      });
    },
    submitForm(ev) {
      ev && ev.preventDefault();
      let isErr;
      this.excuteFormData(this.form);
      this.$refs.form.validate((valid, fields) => {
        isErr = !valid;
        if (!valid) {
          if (_.isElement(this.scrollContainer)) {
            this.createAnchorFixed(fields);
          }
        } else {
          this.loadingHandler();
          this.$emit('change', this.form);
        }
      });
      return isErr;
    },
    resetForm() {
      let cloneForm = _.cloneDeep(this.form);
      this.$refs.form.resetFields();
      this.formItemList.forEach(x => {
        if (x.noResetable) {
          this.form[x.fieldName] = cloneForm[x.fieldName];
        }
      });
      this.excuteFormData(this.form);
      // 清空变量，释放内存
      cloneForm = null;
      // 解决 附件/图片 重复校验的 bug
      this.$nextTick(() => {
        this.formItemList.forEach(x => {
          if (['UPLOAD_FILE', 'UPLOAD_IMG'].includes(x.type)) {
            this.doClearValidate(this.$refs[x.fieldName]);
          }
        });
      });
    },
    createFormLayout() {
      const unfixTypes = ['MULTIPLE_CHECKBOX', 'TEXT_AREA', 'TINYMCE', 'UPLOAD_IMG', 'UPLOAD_FILE'];
      const colSpan = 24 / this.cols;
      const formItems = this.createFormItem().filter(item => item !== null);
      const colFormItems = formItems.map((Node, i) => {
        const spans = _.isUndefined(Node.cols) ? colSpan : Node.cols * colSpan;
        const offsetLeft = _.isUndefined(Node.offsetLeft) ? 0 : Node.offsetLeft * colSpan;
        const offsetRight = _.isUndefined(Node.offsetRight) ? 0 : this.toPercent(Node.offsetRight / this.cols);
        return (
          <el-col
            key={i}
            type={unfixTypes.includes(Node.type) ? 'UN_FIXED' : 'FIXED'}
            id={Node.type !== 'BREAK_SPACE' ? `fp-${Node.fieldName}` : null}
            offset={offsetLeft}
            span={Node.type !== 'BREAK_SPACE' ? spans : 24}
            style={{ marginRight: offsetRight }}
          >
            {Node}
          </el-col>
        );
      });
      return colFormItems;
    },
    createFormButton() {
      const { loading } = this;
      const colSpan = 24 / this.cols;
      return this.isSubmitBtn && this.formType === 'default' ? (
        <el-row gutter={10}>
          <el-col key="-" span={colSpan}>
            <el-form-item label={''}>
              <el-button size="small" type="primary" loading={loading} onClick={this.submitForm}>
                保 存
              </el-button>
              <el-button size="small" onClick={this.resetForm}>
                重 置
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      ) : null;
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
    // 数字格式化
    formatNumber(value = '') {
      value += '';
      const list = value.split('.');
      const prefix = list[0].charAt(0) === '-' ? '-' : '';
      let num = prefix ? list[0].slice(1) : list[0];
      let result = '';
      while (num.length > 3) {
        result = `, ${num.slice(-3)}${result}`;
        num = num.slice(0, num.length - 3);
      }
      if (num) {
        result = num + result;
      }
      return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
    },
    // 保密字段格式化方法
    secretFormat(value = '', type) {
      value += '';
      if (type === 'finance') {
        value = this.formatNumber(value);
      }
      if (type === 'name') {
        value = value.replace(/^([\u4e00-\u9fa5]{1}).+$/, '$1**');
      }
      if (type === 'phone') {
        value = value.replace(/^(\d{3}).+(\d{4})$/, '$1****$2');
      }
      if (type === 'IDnumber') {
        value = value.replace(/^(\d{3}).+(\w{4})$/, '$1***********$2');
      }
      return value;
    },
    // 转百分比
    toPercent(num) {
      return Number(num * 100).toFixed(5) + '%';
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
        const res = await this.getFormData();
        return [false, res];
      } catch (err) {
        if (_.isElement(this.scrollContainer)) {
          this.createAnchorFixed(err);
        }
        return [err, null];
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
    const cls = [
      `v-form-panel`,
      {
        [`form-show`]: this.formType === 'onlyShow'
      }
    ];
    return (
      <div class={cls}>
        <el-form ref="form" {...wrapProps}>
          <el-row gutter={10}>{this.createFormLayout()}</el-row>
          {this.createFormButton()}
        </el-form>
      </div>
    );
  }
};
</script>

<style lang="less">
.v-form-panel {
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
        font-size: @textSize;
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
        .el-select__tags {
          height: 24px;
          overflow-y: auto;
          .el-select__input {
            height: inherit;
          }
        }
      }
      .el-autocomplete {
        width: 100%;
      }
      .el-date-editor {
        width: 100%;
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
        font-size: @textSize;
      }
    }
  }
  &.form-show {
    .is-disabled {
      .el-input__inner,
      .el-textarea__inner {
        border-style: dashed;
        background-color: #fff;
      }
    }
    .el-range-editor.is-disabled {
      border-style: dashed;
      background-color: #fff;
      .el-range-input {
        background-color: #fff;
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
