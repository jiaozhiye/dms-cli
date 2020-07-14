/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-14 15:31:38
 **/
import { get, set, xor, transform, cloneDeep, isEqual, isUndefined, isObject, isFunction, isRegExp, isElement } from 'lodash';
import moment from 'moment';
import PropTypes from '../_utils/vue-types';
import { sleep } from '../_utils/tool';
import Size from '../_utils/mixins/size';
import Locale from '../_utils/mixins/locale';
import PrefixCls from '../_utils/mixins/prefix-cls';
import FormCols from '../_utils/mixins/form-cols';
import pinyin, { STYLE_FIRST_LETTER } from '../Pinyin';
import Cascader from './Cascader.vue';
import BreakSpace from '../BreakSpace';
import UploadFile from '../UploadFile';
import UploadCropper from '../UploadCropper';
import Tinymce from '../Tinymce';
import SearchHelper from '../SearchHelper';
import BaseDialog from '../BaseDialog';

const noop = () => {};

export default {
  name: 'FormPanel',
  mixins: [Locale, Size, PrefixCls, FormCols],
  props: {
    list: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
        fieldName: PropTypes.string
      }).loose
    ).isRequired,
    size: PropTypes.oneOf(['small', 'default', 'large']),
    initialValue: PropTypes.object.def({}),
    formType: PropTypes.string.def('default'),
    cols: PropTypes.number,
    labelWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def(80),
    isSubmitBtn: PropTypes.bool.def(false),
    scrollContainer: PropTypes.any.def(null)
  },
  data() {
    this.arrayTypes = ['RANGE_DATE', 'RANGE_TIME', 'RANGE_TIME_SELECT', 'RANGE_INPUT', 'RANGE_INPUT_NUMBER', 'MULTIPLE_SELECT', 'MULTIPLE_CHECKBOX', 'UPLOAD_IMG', 'UPLOAD_FILE'];
    return {
      form: {}, // 表单的值
      desc: {}, // 描述信息
      visible: {},
      loading: false
    };
  },
  computed: {
    formItemList() {
      const res = [];
      this.list
        .filter(x => x.fieldName)
        .forEach(x => {
          if (x.type === 'BREAK_SPACE') return;
          if (isObject(x.labelOptions) && x.labelOptions.fieldName) {
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
    descContents() {
      return this.formItemList.filter(x => isObject(x.descOptions)).map(x => ({ fieldName: x.fieldName, content: x.descOptions.content }));
    }
  },
  watch: {
    fieldNames(nextProps, prevProps) {
      const diffs = xor(prevProps, nextProps);
      if (!diffs.length) return;
      diffs.forEach(x => {
        if (prevProps.includes(x)) {
          delete this.form[x];
        } else {
          this.$set(this.form, x, this.getInitialValue(this.formItemList.find(k => k.fieldName === x)));
        }
      });
    },
    rules() {
      this.$nextTick(() => this.doClearValidate(this.$refs.form));
    },
    descContents(val) {
      val.forEach(x => (this.desc[x.fieldName] = x.content));
    },
    formType(nextProps) {
      this.formItemList.forEach(x => {
        if (nextProps === 'onlyShow') {
          x.disabled = true;
        }
      });
    },
    form: {
      handler(val) {
        const diff = this.difference(val, this.initialValues);
        if (!Object.keys(diff).length) return;
        this.$emit('valuesChange', diff);
      },
      deep: true
    }
  },
  created() {
    this.initialHandle();
  },
  mounted() {
    this.bindResizeEvent();
  },
  methods: {
    initialHandle() {
      this.form = this.createFormValue();
      this.desc = this.createDescription();
      // Object.assign(this.form, this.createFormValue());
      this.initialValues = cloneDeep(this.form);
      this.initialExtras = cloneDeep(this.desc);
    },
    getInitialValue(item) {
      const { type = '', fieldName, options = {}, readonly } = item;
      // 初始值
      let val = this.initialValue[fieldName];
      if (this.formType === 'onlyShow') {
        item.disabled = true;
      }
      if (this.arrayTypes.includes(type)) {
        val = val ?? [];
      }
      if (type === 'INPUT' && (readonly || item.disabled)) {
        const { secretType } = options;
        if (!!secretType) {
          val = this.secretFormat(val, secretType);
        }
      }
      if (type === 'CHECKBOX') {
        val = val ?? options.falseValue ?? '0';
      }
      if (type === 'INPUT_TREE' && isUndefined(this[`${fieldName}TreeFilterTexts`])) {
        this[`${fieldName}TreeFilterTexts`] = '';
      }
      if (type === 'INPUT_CASCADER' && isUndefined(this[`${fieldName}CascaderTexts`])) {
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
    createDescription() {
      const target = {};
      this.formItemList
        .filter(x => isObject(x.descOptions))
        .forEach(x => {
          target[x.fieldName] = x.descOptions.content;
        });
      return Object.assign({}, target);
    },
    createFormItemLabel(option) {
      const { form } = this;
      const { label, type = 'SELECT', fieldName, options = {}, style = {}, disabled, onChange = noop } = option;
      const { itemList, trueValue = '1', falseValue = '0' } = options;
      return (
        <div slot="label" class="label-wrap" style={{ ...style }}>
          {type === 'SELECT' && (
            <el-select v-model={form[fieldName]} placeholder={''} disabled={disabled} onChange={onChange}>
              {itemList.map(x => (
                <el-option key={x.value} label={x.text} value={x.value} disabled={x.disabled} />
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
      const { fieldName, isTooltip, style = {} } = option;
      const content = this.desc[fieldName] ?? '';
      if (isTooltip) {
        return (
          <el-tooltip effect="dark" placement="right">
            <div slot="content">{content}</div>
            <i class="desc-icon el-icon-info" />
          </el-tooltip>
        );
      }
      return (
        <span title={content} class="desc-text text_overflow_cut" style={{ display: 'inline-block', paddingLeft: '10px', ...style }}>
          {content}
        </span>
      );
    },
    RENDER_FORM_ITEM(option) {
      const { label, fieldName, labelWidth, labelOptions, style = {}, render = noop } = option;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && this.createFormItemLabel(labelOptions)}
          <div class="desc-text" style={{ ...style }}>
            {render()}
          </div>
        </el-form-item>
      );
    },
    INPUT(option) {
      const { form, formType } = this;
      const {
        label,
        fieldName,
        labelWidth,
        labelOptions,
        descOptions,
        options = {},
        searchHelper = {},
        style = {},
        placeholder = this.t('form.inputPlaceholder'),
        readonly,
        disabled,
        onChange = noop
      } = option;
      const { minlength = 0, maxlength, showLimit, password = false, noInput = false, pattern, unitRender, onInput = noop, onEnter = noop, onFocus = noop, onBlur = noop } = options;
      const isSearchHelper = !!Object.keys(searchHelper).length;
      const dialogProps = {
        props: {
          visible: this.visible[fieldName],
          title: this.t('form.searchHelper'),
          showFullScreen: false,
          destroyOnClose: true,
          containerStyle: { height: 'calc(100% - 52px)', paddingBottom: '52px' }
        },
        on: {
          'update:visible': val => (this.visible[fieldName] = val)
        }
      };
      const shProps = {
        props: {
          ...searchHelper
        },
        on: {
          close: (visible, data, alias) => {
            if (isObject(data) && Object.keys(alias).length) {
              const extraKeys = [];
              for (let key in alias) {
                if (key !== 'extra') {
                  form[key] = data[alias[key]];
                  if (key !== fieldName) {
                    extraKeys.push(key);
                  } else {
                    onChange(form[key]);
                  }
                } else {
                  this.desc[fieldName] = data[alias[key]];
                }
              }
              if (extraKeys.length) {
                this[`${fieldName}ExtraKeys`] = extraKeys;
              }
            }
            const { closed = noop } = searchHelper;
            closed(data);
            this.visible[fieldName] = visible;
          }
        }
      };
      const prevValue = form[fieldName];
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && this.createFormItemLabel(labelOptions)}
          <el-input
            value={prevValue}
            onInput={val => {
              // 搜索帮助，不允许输入
              if (isSearchHelper || noInput) return;
              if (isRegExp(pattern)) {
                // 是否为删除动作
                const isRemoveHandle = val.length < (prevValue && prevValue.length);
                // 单元格正则校验
                if (!isRemoveHandle && !pattern.test(val)) return;
              }
              form[fieldName] = val;
              onInput(val);
            }}
            title={prevValue}
            minlength={minlength}
            maxlength={maxlength}
            placeholder={formType !== 'onlyShow' ? placeholder : ''}
            readonly={readonly}
            disabled={disabled}
            style={{ ...style }}
            show-password={password}
            show-word-limit={showLimit}
            clearable
            onClear={() => {
              // 搜索帮助
              if (isSearchHelper || noInput) {
                if (Array.isArray(this[`${fieldName}ExtraKeys`]) && this[`${fieldName}ExtraKeys`].length) {
                  this[`${fieldName}ExtraKeys`].forEach(key => (form[key] = ''));
                }
                this.desc[fieldName] = '';
              }
            }}
            onChange={val => {
              form[fieldName] = val.trim();
              onChange(form[fieldName]);
            }}
            onFocus={onFocus}
            onBlur={() => onBlur(form[fieldName])}
            nativeOnKeydown={e => {
              if (e.keyCode !== 13) return;
              onEnter(e.target.value);
              this.doFormItemValidate(fieldName);
            }}
          >
            {isSearchHelper && (
              <template slot="append">
                <el-button
                  icon="el-icon-search"
                  style={disabled && { cursor: 'not-allowed' }}
                  onClick={ev => {
                    if (disabled) return;
                    const { open = () => true } = searchHelper;
                    if (!open(this.form)) return;
                    this.visible = Object.assign({}, this.visible, { [fieldName]: !0 });
                  }}
                />
              </template>
            )}
            {isFunction(unitRender) && <template slot="append">{<div style={disabled && { pointerEvents: 'none' }}>{unitRender()}</div>}</template>}
          </el-input>
          {descOptions && this.createFormItemDesc({ fieldName, ...descOptions })}
          {isSearchHelper && (
            <BaseDialog {...dialogProps}>
              <SearchHelper {...shProps} />
            </BaseDialog>
          )}
        </el-form-item>
      );
    },
    INPUT_NUMBER(option) {
      const { form, formType } = this;
      const { label, fieldName, labelWidth, labelOptions, descOptions, options = {}, style = {}, placeholder = this.t('form.inputPlaceholder'), disabled, onChange = noop } = option;
      const { maxlength, min = 0, max, step = 1, precision } = options;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && this.createFormItemLabel(labelOptions)}
          <el-input-number
            v-model={form[fieldName]}
            placeholder={formType !== 'onlyShow' ? placeholder : ''}
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
          {descOptions && this.createFormItemDesc({ fieldName, ...descOptions })}
        </el-form-item>
      );
    },
    RANGE_INPUT(option) {
      const { form, formType } = this;
      const { label, fieldName, labelWidth, labelOptions, readonly, disabled, onChange = noop } = option;
      const [startFieldName, endFieldName] = fieldName.split('|');
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && this.createFormItemLabel(labelOptions)}
          <el-input
            v-model={form[fieldName][0]}
            readonly={readonly}
            disabled={disabled}
            placeholder={formType !== 'onlyShow' ? this.t('form.startValue') : ''}
            style={{ width: `calc(50% - 7px)` }}
            clearable
            onChange={() => onChange({ [startFieldName]: form[fieldName][0] })}
          />
          <span style="display: inline-block; text-align: center; width: 14px;">-</span>
          <el-input
            v-model={form[fieldName][1]}
            readonly={readonly}
            disabled={disabled}
            placeholder={formType !== 'onlyShow' ? this.t('form.endValue') : ''}
            style={{ width: `calc(50% - 7px)` }}
            clearable
            onChange={() => onChange({ [endFieldName]: form[fieldName][1] })}
          />
        </el-form-item>
      );
    },
    RANGE_INPUT_NUMBER(option) {
      const { form, formType } = this;
      const { label, fieldName, labelWidth, labelOptions, options = {}, readonly, disabled, onChange = noop } = option;
      const { min = 0, max, step = 1, precision } = options;
      const [startVal = min, endVal = max] = form[fieldName];
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && this.createFormItemLabel(labelOptions)}
          <el-input-number
            v-model={form[fieldName][0]}
            controls-position="right"
            min={min}
            max={endVal}
            step={step}
            precision={precision}
            readonly={readonly}
            disabled={disabled}
            placeholder={formType !== 'onlyShow' ? this.t('form.startValue') : ''}
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
            placeholder={formType !== 'onlyShow' ? this.t('form.endValue') : ''}
            controls={false}
            style={{ width: `calc(50% - 7px)` }}
            clearable
            onChange={() => onChange(form[fieldName])}
          />
        </el-form-item>
      );
    },
    INPUT_TREE(option) {
      const { form, formType } = this;
      const { label, fieldName, labelWidth, labelOptions, options = {}, style = {}, placeholder = this.t('form.inputPlaceholder'), readonly, disabled, onChange = noop } = option;
      const { itemList } = options;
      const treeWrapProps = {
        props: {
          props: { children: 'children', label: 'text' },
          data: itemList
        }
      };
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && this.createFormItemLabel(labelOptions)}
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
                placeholder={this.t('form.treePlaceholder')}
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
                  onChange(this.form[fieldName], data);
                }}
              />
            </div>
            <el-input
              slot="reference"
              value={this.createInputTreeValue(fieldName, itemList)}
              placeholder={formType !== 'onlyShow' ? placeholder : ''}
              readonly={readonly}
              disabled={disabled}
              clearable
              style={disabled && { pointerEvents: 'none' }}
              onClear={() => {
                this.treeNodeClickHandle(fieldName, {});
                onChange(this.form[fieldName], null);
              }}
            />
          </el-popover>
        </el-form-item>
      );
    },
    INPUT_CASCADER(option) {
      const { form, formType } = this;
      const { label, fieldName, labelWidth, labelOptions, options = {}, style = {}, placeholder = this.t('form.selectPlaceholder'), readonly, disabled, onChange = noop } = option;
      const { itemList, titles = [], mustCheckLast } = options;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && this.createFormItemLabel(labelOptions)}
          <el-popover v-model={this.visible[fieldName]} transition="el-zoom-in-top" placement="bottom-start" trigger="click">
            <div style={{ maxHeight: '250px', overflowY: 'auto', ...style }}>
              <Cascader
                value={form[fieldName]}
                onInput={val => {
                  this.cascaderChangeHandle(fieldName, val);
                }}
                list={itemList}
                labels={titles}
                mustCheckLast={mustCheckLast}
                style={style}
                onChange={() => {
                  onChange(form[fieldName], this[`${fieldName}CascaderTexts`]);
                }}
                onClose={val => {
                  this.visible[fieldName] = val;
                }}
              />
            </div>
            <el-input
              slot="reference"
              value={this[`${fieldName}CascaderTexts`]}
              placeholder={formType !== 'onlyShow' ? placeholder : ''}
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
      const { form, formType } = this;
      const { label, fieldName, labelWidth, labelOptions, request = {}, style = {}, placeholder = this.t('form.inputPlaceholder'), disabled, onChange = noop } = option;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && this.createFormItemLabel(labelOptions)}
          <el-autocomplete
            v-model={form[fieldName]}
            placeholder={formType !== 'onlyShow' ? placeholder : ''}
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
      const { form, formType } = this;
      const { label, fieldName, labelWidth, options = {}, labelOptions, style = {}, placeholder = this.t('form.inputPlaceholder'), disabled, onChange = noop } = option;
      const { itemList } = options;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && this.createFormItemLabel(labelOptions)}
          <el-autocomplete
            v-model={form[fieldName]}
            valueKey="text"
            placeholder={formType !== 'onlyShow' ? placeholder : ''}
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
      const { form, formType } = this;
      const conf = {
        date: {
          placeholder: this.t('form.datePlaceholder'),
          valueFormat: 'yyyy-MM-dd HH:mm:ss'
        },
        datetime: {
          placeholder: this.t('form.datetimePlaceholder'),
          valueFormat: 'yyyy-MM-dd HH:mm:ss'
        },
        exactdate: {
          placeholder: this.t('form.datePlaceholder'),
          valueFormat: 'yyyy-MM-dd'
        },
        month: {
          placeholder: this.t('form.monthPlaceholder'),
          valueFormat: 'yyyy-MM'
        },
        year: {
          placeholder: this.t('form.yearPlaceholder'),
          valueFormat: 'yyyy'
        }
      };
      const { label, fieldName, labelWidth, labelOptions, options = {}, style = {}, disabled, onChange = noop } = option;
      const { dateType = 'date', minDateTime, maxDateTime, defaultTime } = options;
      // 日期快捷键方法
      const createPicker = (picker, days) => {
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * Number(days));
        picker.$emit('pick', start);
      };
      const pickers = [
        {
          text: this.t('form.datePickers')[0],
          onClick(picker) {
            createPicker(picker, 0);
          }
        },
        {
          text: this.t('form.datePickers')[1],
          onClick(picker) {
            createPicker(picker, 1);
          }
        },
        {
          text: this.t('form.datePickers')[2],
          onClick(picker) {
            createPicker(picker, 7);
          }
        },
        {
          text: this.t('form.datePickers')[3],
          onClick(picker) {
            createPicker(picker, 30);
          }
        }
      ];
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && this.createFormItemLabel(labelOptions)}
          <el-date-picker
            ref={fieldName}
            type={dateType.replace('exact', '')}
            value={form[fieldName]}
            onInput={val => {
              val = !val ? this.getDefaultStartTime(minDateTime) : val;
              form[fieldName] = this.formatDate(val, conf[dateType].valueFormat, dateType === 'datetime');
            }}
            default-time={defaultTime}
            value-format={conf[dateType].valueFormat}
            placeholder={formType !== 'onlyShow' ? conf[dateType].placeholder : ''}
            disabled={disabled}
            style={{ ...style }}
            picker-options={{
              disabledDate: time => {
                return this.setDisabledDate(time, [minDateTime, maxDateTime]);
              },
              shortcuts: pickers
            }}
            nativeOnInput={ev => {
              ev.target.value = ev.target.value.slice(0, 10).replace(/(\d{4})-?(\d{2})-?(\d{2})/, '$1-$2-$3');
              this.isDateChange = !0;
            }}
            onBlur={C => {
              if (!this.isDateChange) return;
              this.isDateChange = !1;
              const currentVal = C.$el.children[0].value;
              if (!/^[\d-\s\:]+$/.test(currentVal)) return;
              const passed = !this.setDisabledDate(moment(currentVal).toDate(), [minDateTime, maxDateTime]);
              if (passed) {
                form[fieldName] = this.formatDate(currentVal, conf[dateType].valueFormat);
                onChange(form[fieldName]);
              }
            }}
            nativeOnKeydown={ev => {
              if (ev.keyCode === 13) {
                if (!this.isDateChange) return;
                const currentVal = ev.target.value;
                if (!/^[\d-\s\:]+$/.test(currentVal)) return;
                const passed = !this.setDisabledDate(moment(currentVal).toDate(), [minDateTime, maxDateTime]);
                if (passed) {
                  form[fieldName] = this.formatDate(currentVal, conf[dateType].valueFormat);
                }
                this.$refs[`${fieldName}`].hidePicker();
              }
            }}
            onChange={() => onChange(form[fieldName])}
          />
        </el-form-item>
      );
    },
    RANGE_DATE(option) {
      const { form, formType } = this;
      const conf = {
        daterange: {
          placeholder: this.t('form.daterangePlaceholder'),
          valueFormat: 'yyyy-MM-dd HH:mm:ss'
        },
        datetimerange: {
          placeholder: this.t('form.datetimerangePlaceholder'),
          valueFormat: 'yyyy-MM-dd HH:mm:ss'
        },
        exactdaterange: {
          placeholder: this.t('form.daterangePlaceholder'),
          valueFormat: 'yyyy-MM-dd'
        },
        monthrange: {
          placeholder: this.t('form.monthrangePlaceholder'),
          valueFormat: 'yyyy-MM'
        }
      };
      const { label, fieldName, labelWidth, labelOptions, options = {}, style = {}, disabled, onChange = noop } = option;
      const { dateType = 'daterange', minDateTime, maxDateTime } = options;
      const [startDate = minDateTime, endDate = maxDateTime] = form[fieldName];
      // 日期区间快捷键方法
      const createPicker = (picker, days) => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * Number(days));
        picker.$emit('pick', start);
      };
      const pickers = [
        {
          text: this.t('form.dateRangePickers')[0],
          onClick(picker) {
            createPicker(picker, 7);
          }
        },
        {
          text: this.t('form.dateRangePickers')[1],
          onClick(picker) {
            createPicker(picker, 30);
          }
        },
        {
          text: this.t('form.dateRangePickers')[2],
          onClick(picker) {
            createPicker(picker, 90);
          }
        },
        {
          text: this.t('form.dateRangePickers')[3],
          onClick(picker) {
            createPicker(picker, 180);
          }
        }
      ];
      const cls = [`range-date`, { [`disabled`]: disabled }];
      return (
        <el-form-item key={fieldName} ref={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && this.createFormItemLabel(labelOptions)}
          <div class={cls} style={{ ...style }}>
            <el-date-picker
              ref={`${fieldName}-start`}
              type={dateType.replace('exact', '').slice(0, -5)}
              value={form[fieldName][0]}
              onInput={val => {
                val = !val ? this.getDefaultStartTime(minDateTime) : val;
                form[fieldName] = this.formatDate([val, form[fieldName][1]], conf[dateType].valueFormat);
              }}
              pickerOptions={{
                disabledDate: time => {
                  return this.setDisabledDate(time, [minDateTime, endDate]);
                },
                shortcuts: dateType.includes('date') ? pickers : pickers.slice(1)
              }}
              value-format={conf[dateType].valueFormat}
              style={{ width: `calc(50% - 5px)` }}
              placeholder={formType !== 'onlyShow' ? conf[dateType].placeholder[0] : ''}
              disabled={disabled}
              nativeOnInput={ev => {
                ev.target.value = ev.target.value.slice(0, 10).replace(/(\d{4})-?(\d{2})-?(\d{2})/, '$1-$2-$3');
                this.isDateChange = !0;
              }}
              onBlur={C => {
                if (!this.isDateChange) return;
                this.isDateChange = !1;
                const startVal = C.$el.children[0].value;
                if (!/^[\d-\s\:]+$/.test(startVal)) return;
                const passed = !this.setDisabledDate(moment(startVal).toDate(), [minDateTime, endDate]);
                if (passed) {
                  form[fieldName] = this.formatDate([startVal, form[fieldName][1]], conf[dateType].valueFormat);
                }
              }}
              nativeOnKeydown={ev => {
                if (ev.keyCode === 13) {
                  if (!this.isDateChange) return;
                  const startVal = ev.target.value;
                  if (!/^[\d-\s\:]+$/.test(startVal)) return;
                  const passed = !this.setDisabledDate(moment(startVal).toDate(), [minDateTime, endDate]);
                  if (passed) {
                    form[fieldName] = this.formatDate([startVal, form[fieldName][1]], conf[dateType].valueFormat);
                  }
                  this.$refs[`${fieldName}-start`].hidePicker();
                }
              }}
              onChange={() => onChange(form[fieldName])}
            />
            <span class={disabled ? 'is-disabled' : ''} style="display: inline-block; text-align: center; width: 10px;">
              -
            </span>
            <el-date-picker
              ref={`${fieldName}-end`}
              type={dateType.replace('exact', '').slice(0, -5)}
              value={form[fieldName][1]}
              onInput={val => {
                form[fieldName] = this.formatDate([form[fieldName][0], val ?? ''], conf[dateType].valueFormat);
              }}
              pickerOptions={{
                disabledDate: time => {
                  return this.setDisabledDate(time, [startDate, maxDateTime]);
                }
              }}
              value-format={conf[dateType].valueFormat}
              style={{ width: `calc(50% - 5px)` }}
              placeholder={formType !== 'onlyShow' ? conf[dateType].placeholder[1] : ''}
              disabled={disabled}
              nativeOnInput={ev => {
                ev.target.value = ev.target.value.slice(0, 10).replace(/(\d{4})-?(\d{2})-?(\d{2})/, '$1-$2-$3');
                this.isDateChange = !0;
              }}
              onBlur={C => {
                if (!this.isDateChange) return;
                this.isDateChange = !1;
                const endVal = C.$el.children[0].value;
                if (!/^[\d-\s\:]+$/.test(endVal)) return;
                const passed = !this.setDisabledDate(moment(endVal).toDate(), [startDate, maxDateTime]);
                if (passed) {
                  form[fieldName] = this.formatDate([form[fieldName][0], endVal], conf[dateType].valueFormat);
                }
              }}
              nativeOnKeydown={ev => {
                if (ev.keyCode === 13) {
                  if (!this.isDateChange) return;
                  const endVal = ev.target.value;
                  if (!/^[\d-\s\:]+$/.test(endVal)) return;
                  const passed = !this.setDisabledDate(moment(endVal).toDate(), [startDate, maxDateTime]);
                  if (passed) {
                    form[fieldName] = this.formatDate([form[fieldName][0], endVal], conf[dateType].valueFormat);
                  }
                  this.$refs[`${fieldName}-end`].hidePicker();
                }
              }}
              onChange={() => onChange(form[fieldName])}
            />
          </div>
        </el-form-item>
      );
    },
    TIME(option) {
      const { form, formType } = this;
      const { label, fieldName, labelWidth, labelOptions, options = {}, valueFormat = 'HH:mm:ss', style = {}, placeholder = this.t('form.datetimePlaceholder'), disabled, onChange = noop } = option;
      const { defaultTime } = options;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && this.createFormItemLabel(labelOptions)}
          <el-time-picker
            v-model={form[fieldName]}
            pickerOptions={{
              format: valueFormat
            }}
            default-value={defaultTime}
            value-format={valueFormat}
            placeholder={formType !== 'onlyShow' ? placeholder : ''}
            disabled={disabled}
            style={{ ...style }}
            onChange={onChange}
          />
        </el-form-item>
      );
    },
    RANGE_TIME(option) {
      const { form, formType } = this;
      const { label, fieldName, labelWidth, labelOptions, valueFormat = 'HH:mm:ss', style = {}, disabled, onChange = noop } = option;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && this.createFormItemLabel(labelOptions)}
          <el-time-picker
            isRange={true}
            value={form[fieldName].length ? form[fieldName] : undefined}
            onInput={val => {
              val = val === null ? [] : val;
              form[fieldName] = val;
            }}
            value-format={valueFormat}
            range-separator="-"
            start-placeholder={formType !== 'onlyShow' ? this.t('form.datetimerangePlaceholder')[0] : ''}
            end-placeholder={formType !== 'onlyShow' ? this.t('form.datetimerangePlaceholder')[1] : ''}
            disabled={disabled}
            style={{ ...style }}
            onChange={() => onChange(form[fieldName])}
          />
        </el-form-item>
      );
    },
    TIME_SELECT(option) {
      const { form, formType } = this;
      const { label, fieldName, labelWidth, labelOptions, options = {}, valueFormat = 'HH:mm', style = {}, placeholder = this.t('form.datetimePlaceholder'), disabled, onChange = noop } = option;
      const { defaultTime, startTime = '00:00', endTime = '23:45', stepTime = '00:15' } = options;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && this.createFormItemLabel(labelOptions)}
          <el-time-select
            v-model={form[fieldName]}
            pickerOptions={{
              start: startTime,
              end: endTime,
              step: stepTime
            }}
            default-value={defaultTime}
            value-format={valueFormat}
            placeholder={formType !== 'onlyShow' ? placeholder : ''}
            disabled={disabled}
            style={{ ...style }}
            onChange={onChange}
          />
        </el-form-item>
      );
    },
    RANGE_TIME_SELECT(option) {
      const { form, formType } = this;
      const { label, fieldName, labelWidth, labelOptions, options = {}, valueFormat = 'HH:mm', style = {}, disabled, onChange = noop } = option;
      const { startTime = '00:00', endTime = '23:45', stepTime = '00:15' } = options;
      const stepMinute = moment(stepTime, valueFormat).minute();
      const [startVal, endVal] = form[fieldName];
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && this.createFormItemLabel(labelOptions)}
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
            placeholder={formType !== 'onlyShow' ? this.t('form.datetimerangePlaceholder')[0] : ''}
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
            placeholder={formType !== 'onlyShow' ? this.t('form.datetimerangePlaceholder')[1] : ''}
            disabled={disabled}
            style={{ width: `calc(50% - 7px)` }}
            onChange={() => onChange(form[fieldName])}
          />
        </el-form-item>
      );
    },
    CHECKBOX(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, descOptions, options = {}, style = {}, disabled, onChange = noop } = option;
      const { trueValue = '1', falseValue = '0' } = options;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && this.createFormItemLabel(labelOptions)}
          <el-checkbox v-model={form[fieldName]} disabled={disabled} style={{ ...style }} trueLabel={trueValue} falseLabel={falseValue} onChange={onChange} />
          {descOptions && this.createFormItemDesc({ fieldName, ...descOptions })}
        </el-form-item>
      );
    },
    MULTIPLE_CHECKBOX(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, descOptions, options = {}, style = {}, disabled, onChange = noop } = option;
      const { itemList, limit } = options;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && this.createFormItemLabel(labelOptions)}
          <el-checkbox-group v-model={form[fieldName]} max={limit} disabled={disabled} style={{ ...style }} onChange={onChange}>
            {itemList.map(x => {
              return (
                <el-checkbox key={x.value} label={x.value} disabled={x.disabled}>
                  {x.text}
                </el-checkbox>
              );
            })}
          </el-checkbox-group>
          {descOptions && this.createFormItemDesc({ fieldName, ...descOptions })}
        </el-form-item>
      );
    },
    RADIO(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, descOptions, options, style = {}, disabled, onChange = noop } = option;
      const { itemList } = options;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && this.createFormItemLabel(labelOptions)}
          <el-radio-group v-model={form[fieldName]} disabled={disabled} style={{ ...style }} onChange={onChange}>
            {itemList.map(x => (
              <el-radio key={x.value} label={x.value} disabled={x.disabled}>
                {x.text}
              </el-radio>
            ))}
          </el-radio-group>
          {descOptions && this.createFormItemDesc({ fieldName, ...descOptions })}
        </el-form-item>
      );
    },
    TEXT_AREA(option) {
      const { form, formType } = this;
      const { label, fieldName, labelWidth, labelOptions, options = {}, style = {}, placeholder = this.t('form.inputPlaceholder'), disabled, onChange = noop } = option;
      const { rows = 2, maxlength = 200 } = options;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && this.createFormItemLabel(labelOptions)}
          <el-input
            type="textarea"
            v-model={form[fieldName]}
            placeholder={formType !== 'onlyShow' ? placeholder : ''}
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
          {labelOptions && this.createFormItemLabel(labelOptions)}
          <UploadCropper
            actionUrl={upload.actionUrl}
            headers={upload.headers}
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
          {labelOptions && this.createFormItemLabel(labelOptions)}
          <UploadFile
            actionUrl={upload.actionUrl}
            headers={upload.headers}
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
            {this.t('uploadFile.text')}
          </UploadFile>
        </el-form-item>
      );
    },
    TINYMCE(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, height, upload, disabled, onChange = noop } = option;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && this.createFormItemLabel(labelOptions)}
          <Tinymce v-model={form[fieldName]} upload={upload} height={height} disabled={disabled} onChange={onChange} />
        </el-form-item>
      );
    },
    BREAK_SPACE(option) {
      const { label = this.t('form.breakSpace'), id, style = {} } = option;
      return <BreakSpace label={label} id={id} labelStyle={style} />;
    },
    createSelectHandle(option, multiple = false) {
      const { form, formType } = this;
      const {
        label,
        fieldName,
        labelWidth,
        labelOptions,
        descOptions,
        options = {},
        request = {},
        style = {},
        placeholder = this.t('form.selectPlaceholder'),
        disabled,
        clearable = !0,
        onChange = noop
      } = option;
      const { filterable, limit } = options;
      const { fetchApi, params = {} } = request;
      let itemList = options.itemList || [];
      if (!options.itemList && fetchApi) {
        itemList = this[`${fieldName}ItemList`] || [];
        if (!isEqual(this[`${fieldName}PrevParams`], params)) {
          this[`${fieldName}PrevParams`] = params;
          this.querySelectOptions(request, fieldName);
        }
      }
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && this.createFormItemLabel(labelOptions)}
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
            placeholder={formType !== 'onlyShow' ? placeholder : ''}
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
          {descOptions && this.createFormItemDesc({ fieldName, ...descOptions })}
        </el-form-item>
      );
    },
    // 下拉框的筛选方法
    filterMethodHandle(fieldName, queryString = '') {
      const target = this.formItemList.find(x => x.fieldName === fieldName);
      const { options = {} } = target;
      const itemList = options.itemList || this[`${fieldName}ItemList`] || [];
      if (!this[`${fieldName}OriginItemList`] || !itemList.__filtered__) {
        this[`${fieldName}OriginItemList`] = itemList;
      }
      const res = queryString ? this[`${fieldName}OriginItemList`].filter(this.createSearchHelpFilter(queryString)) : [...this[`${fieldName}OriginItemList`]];
      res.__filtered__ = true;
      if (!this[`${fieldName}ItemList`]) {
        set(target, 'options.itemList', res);
      } else {
        this[`${fieldName}ItemList`] = res;
      }
      this.$forceUpdate();
    },
    // 获取下拉框数据
    async querySelectOptions({ fetchApi, params = {}, datakey = '', valueKey = 'value', textKey = 'text' }, fieldName) {
      if (process.env.MOCK_DATA === 'true') {
        const res = require('@/mock/sHelperData').default;
        this[`${fieldName}ItemList`] = res.data.map(x => ({ value: x[valueKey], text: x[textKey] }));
      } else {
        const res = await fetchApi(params);
        if (res.code === 200) {
          const dataList = !datakey ? res.data : get(res.data, datakey, []);
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
        if (res.code === 200) {
          const dataList = !datakey ? res.data : get(res.data, datakey, []);
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
          VNode['cols'] = item.type === 'TINYMCE' ? this.flexCols : item.selfCols;
          VNode['offsetLeft'] = item.offsetLeftCols;
          VNode['offsetRight'] = item.offsetRightCols;
          return VNode;
        });
    },
    doClearValidate($ref) {
      $ref?.clearValidate();
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
            if (form[fieldName].every(x => isUndefined(x))) {
              form[fieldName] = [];
            }
            if (form[fieldName].some(x => isUndefined(x))) {
              let val = form[fieldName].find(x => !isUndefined(x));
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
    getNodeOffset(elem, container, rest = { left: 0, top: 0 }) {
      if (elem) {
        const parentElem = elem.parentNode;
        rest.top += elem.offsetTop;
        rest.left += elem.offsetLeft;
        if (parentElem && parentElem !== document.documentElement && parentElem !== document.body) {
          rest.top -= parentElem.scrollTop;
          rest.left -= parentElem.scrollLeft;
        }
        if (container && (elem === container || elem.offsetParent === container) ? 0 : elem.offsetParent) {
          return this.getNodeOffset(elem.offsetParent, container, rest);
        }
      }
      return rest;
    },
    // 计算目标元素相对于滚动容器的上边距
    calcOffsetTop(_id) {
      const $target = document.getElementById(`fp-${_id}`);
      const $container = this.scrollContainer.offsetParent;
      return this.getNodeOffset($target, $container).top - this.scrollContainer.offsetTop;
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
    emitFormChange() {
      this.$emit('change', { ...this.form });
    },
    submitForm(ev) {
      ev?.preventDefault();
      let isErr;
      this.excuteFormData(this.form);
      this.$refs.form.validate((valid, fields) => {
        isErr = !valid;
        if (!valid) {
          if (isElement(this.scrollContainer)) {
            this.createAnchorFixed(fields);
          }
        } else {
          this.loadingHandler();
          this.emitFormChange();
        }
      });
      return isErr;
    },
    resetForm() {
      const noResetValue = {};
      this.formItemList.forEach(x => {
        // 搜索帮助
        let extraKeys = this[`${x.fieldName}ExtraKeys`];
        if (Array.isArray(extraKeys) && extraKeys.length) {
          extraKeys.forEach(key => (this.form[key] = undefined));
        }
        if (!x.noResetable) return;
        noResetValue[x.fieldName] = this.form[x.fieldName];
      });
      this.$refs.form.resetFields();
      this.desc = Object.assign({}, this.initialExtras);
      Object.assign(this.form, noResetValue);
      this.excuteFormData(this.form);
      // 解决 附件/图片 重复校验的 bug
      this.$nextTick(() => {
        this.formItemList.forEach(x => {
          if (['RANGE_DATE', 'UPLOAD_FILE', 'UPLOAD_IMG'].includes(x.type)) {
            this.doClearValidate(this.$refs[x.fieldName]);
          }
        });
      });
    },
    createFormLayout() {
      const { flexCols: cols } = this;
      const unfixTypes = ['MULTIPLE_CHECKBOX', 'TEXT_AREA', 'TINYMCE', 'UPLOAD_IMG', 'UPLOAD_FILE'];
      const colSpan = 24 / cols;
      const formItems = this.createFormItem().filter(item => item !== null);
      const colFormItems = formItems.map((Node, i) => {
        const spans = isUndefined(Node.cols) ? colSpan : Node.cols * colSpan;
        const offsetLeft = isUndefined(Node.offsetLeft) ? 0 : Node.offsetLeft * colSpan;
        const offsetRight = isUndefined(Node.offsetRight) ? 0 : this.toPercent(Node.offsetRight / cols);
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
      const { loading, flexCols: cols } = this;
      const colSpan = 24 / cols;
      return this.isSubmitBtn && this.formType === 'default' ? (
        <el-row gutter={4}>
          <el-col key="-" span={colSpan}>
            <el-form-item label={''}>
              <el-button type="primary" loading={loading} onClick={this.submitForm}>
                {this.t('form.save')}
              </el-button>
              <el-button onClick={this.resetForm}>{this.t('form.reset')}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      ) : null;
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
    getDefaultStartTime(datetime) {
      return datetime ? `${moment(datetime).format('YYYY-MM-DD')} 00:00:00` : '1900-01-01 00:00:00';
    },
    getDefaultEndTime(datetime) {
      return datetime ? `${moment(datetime).format('YYYY-MM-DD')} 23:59:59` : `${moment().format('YYYY-MM-DD')} 23:59:59`;
    },
    // 日期格式化
    formatDate(val, vf, nft) {
      const arr = Array.isArray(val) ? val : [val];
      const mType = vf.replace('yyyy', 'YYYY').replace('dd', 'DD');
      let res = arr.map((x, i) => {
        x = x ?? '';
        let item = /^[\d-\s\:]+$/.test(x) ? moment(x).format(mType) : '';
        if (item === 'Invalid date') {
          item = '';
        }
        if (!item) {
          item = i === 0 ? this.getDefaultStartTime() : this.getDefaultEndTime();
        }
        return item;
      });
      // 日期区间类型 & 后边小于前边
      if (res.length > 1 && moment(res[1]).isBefore(res[0])) {
        res[1] = res[0];
      }
      if (!nft) {
        res = res.map((x, i) => {
          return i === 0 ? x.replace(/\d{2}:\d{2}:\d{2}$/, '00:00:00') : x.replace(/\d{2}:\d{2}:\d{2}$/, '23:59:59');
        });
      }
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
    difference(object, base) {
      return transform(object, (result, value, key) => {
        if (!isEqual(value, base[key])) {
          result[key] = isObject(value) && isObject(base[key]) ? this.difference(value, base[key]) : value;
        }
      });
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
    SET_FIELDS_VALUE(values = {}, whiteList = []) {
      for (let key in values) {
        if (this.fieldNames.includes(key)) {
          this.form[key] = values[key];
        }
      }
    },
    SET_FORM_VALUES(values = {}) {
      for (let key in values) {
        this.form[key] = values[key];
      }
    },
    async GET_FORM_DATA() {
      try {
        const res = await this.getFormData();
        return [false, { ...res }];
      } catch (err) {
        if (isElement(this.scrollContainer)) {
          this.createAnchorFixed(err);
        }
        return [err, null];
      }
    },
    GET_FIELD_VALUE(fieldName) {
      return this.form[fieldName];
    }
  },
  render() {
    const { form, formType, rules, labelWidth } = this;
    const prefixCls = this.getPrefixCls('form-panel');
    const cls = {
      [prefixCls]: true,
      [`${prefixCls}-show`]: formType === 'onlyShow',
      [`${prefixCls}-sm`]: this.currentSize === 'small',
      [`${prefixCls}-lg`]: this.currentSize === 'large'
    };
    const wrapProps = {
      props: {
        model: form,
        rules,
        labelWidth: labelWidth > 0 ? `${labelWidth}px` : labelWidth
      },
      nativeOn: {
        submit: ev => ev.preventDefault()
      }
    };
    return (
      <div class={cls}>
        <el-form ref="form" {...wrapProps}>
          <el-row gutter={4}>{this.createFormLayout()}</el-row>
          {this.createFormButton()}
        </el-form>
      </div>
    );
  }
};
