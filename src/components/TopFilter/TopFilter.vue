<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-05-06 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-08-15 16:28:04
 **/
import _ from 'lodash';
import moment from 'moment';
import pinyin, { STYLE_FIRST_LETTER } from '@/components/Pinyin/index';
import Cascader from '@/components/FormPanel/Cascader.vue';

export default {
  name: 'TopFilter',
  props: {
    list: {
      type: Array,
      required: true
    },
    cols: {
      type: Number,
      default: 3
    },
    labelWidth: {
      type: [Number, String],
      default: 80
    },
    collapse: {
      type: Boolean,
      default: true
    },
    isSubmitBtn: {
      type: Boolean,
      default: true
    },
    rows: {
      type: Number,
      default: 1
    }
  },
  data() {
    this.treeProps = { children: 'children', label: 'text' };
    this.prevForm = null;
    this.arrayTypes = ['RANGE_DATE', 'RANGE_INPUT_NUMBER', 'MULTIPLE_SELECT', 'MULTIPLE_CHECKBOX'];
    return {
      form: {},
      expand: false, // 展开收起状态
      visible: {}
    };
  },
  created() {
    this.initialHandle();
  },
  computed: {
    fieldNames() {
      return this.list
        .filter(x => !x.hidden)
        .map(x => x.fieldName)
        .filter(x => !!x);
    },
    formItemList() {
      const res = [];
      this.list
        .filter(x => !x.hidden)
        .forEach(x => {
          if (_.isObject(x.labelOptions)) {
            res.push(x.labelOptions);
          }
          res.push(x);
        });
      return res;
    },
    rules() {
      const target = {};
      this.list
        .filter(x => !x.hidden)
        .forEach(x => {
          if (!(x.fieldName && x.rules)) return;
          target[x.fieldName] = x.rules;
        });
      return target;
    }
  },
  watch: {
    formItemList: {
      handler(nextProps, prevProps) {
        if (nextProps.length !== prevProps.length) {
          this.initialHandle();
        }
        this.debounce(this.resetFormData, 10)(nextProps);
      },
      deep: true
    },
    form: {
      handler(nextProps) {
        const res = this.difference(nextProps, this.prevForm);
        if (!Object.keys(res).length) return;
        for (let key in res) {
          let target = this.formItemList.find(x => x.fieldName === key);
          if (!target) continue;
          // 同步 initialValue 的值
          target.initialValue = res[key];
        }
        this.prevForm = { ...nextProps };
      },
      deep: true
    },
    fieldNames() {
      this.$nextTick(() => this.$refs.form.clearValidate());
    },
    expand(val) {
      if (!this.collapse) return;
      this.$emit('onCollapse', val);
    }
  },
  methods: {
    initialHandle() {
      this.form = this.createFormData();
      this.prevForm = { ...this.form };
    },
    getInitialValue(item) {
      let { initialValue, type = '', fieldName } = item;
      if (this.arrayTypes.includes(type)) {
        initialValue = initialValue || [];
      }
      // 树选择器
      if (type === 'INPUT_TREE' && _.isUndefined(this[`${fieldName}TreeFilterTexts`])) {
        this[`${fieldName}TreeFilterTexts`] = '';
      }
      // 级联选择器
      if (type === 'INPUT_CASCADER' && _.isUndefined(this[`${fieldName}CascaderTexts`])) {
        this[`${fieldName}CascaderTexts`] = '';
      }
      return initialValue;
    },
    createFormData() {
      const target = {};
      this.formItemList.forEach(x => {
        const val = this.getInitialValue(x);
        // 设置 initialValue 为响应式数据
        this.$set(x, 'initialValue', val);
        // 初始值
        target[x.fieldName] = val;
      });
      return target;
    },
    resetFormData(list) {
      list.forEach(x => {
        if (_.isEqual(x.initialValue, this.form[x.fieldName])) return;
        this.form[x.fieldName] = this.getInitialValue(x);
        // 对组件外 js 动态赋值的表单元素进行校验
        this.$refs.form.validateField(x.fieldName);
      });
    },
    createFormItemLabel(option) {
      const { form } = this;
      const { fieldName, itemList, style = {}, disabled, change = () => {} } = option;
      return (
        <div class="label-wrap" style={{ ...style }}>
          <el-select v-model={form[fieldName]} placeholder={''} disabled={disabled} onChange={change}>
            {itemList.map(x => (
              <el-option key={x.value} label={x.text} value={x.value} />
            ))}
          </el-select>
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
        <span class="desc-text" style={{ ...style }}>
          {content}
        </span>
      );
    },
    RENDER_FORM_ITEM(option) {
      const { label, fieldName, labelWidth, labelOptions, render = () => {} } = option;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <div>{render()}</div>
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
            onChange={change}
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
      const { label, fieldName, labelWidth, labelOptions, descOptions, style = {}, placeholder = '请输入...', disabled, min = 0, max = 99999999, step = 1, precision, change = () => {} } = option;
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
            clearable
            onChange={change}
            nativeOnKeydown={this.enterEventHandle}
          ></el-input-number>
          {this.createFormItemDesc(descOptions)}
        </el-form-item>
      );
    },
    RANGE_INPUT_NUMBER(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, min = 0, max = 99999999, step = 1, precision, readonly, disabled, change = () => {} } = option;
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
      return (
        <el-form-item key={fieldName} ref={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-popover
            v-model={this.visible[fieldName]}
            visibleArrow={false}
            placement="bottom-start"
            trigger="click"
            on-after-leave={() => {
              this[`${fieldName}TreeFilterTexts`] = '';
              this.treeFilterTextHandle(fieldName);
            }}
          >
            <div class="el-input--small" style={{ maxHeight: '250px', overflowY: 'auto', ...style }}>
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
                style={{ marginTop: '4px' }}
                data={itemList}
                props={this.treeProps}
                defaultExpandAll={true}
                expandOnClickNode={false}
                filterNodeMethod={this.filterNodeHandle}
                on-node-click={data => this.treeNodeClickHandle(fieldName, data)}
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
              onClear={() => this.treeInputClearHandle(fieldName)}
              onChange={change}
              nativeOnKeydown={this.enterEventHandle}
            ></el-input>
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
          <el-popover v-model={this.visible[fieldName]} visibleArrow={false} placement="bottom-start" trigger="click">
            <div style={{ maxHeight: '250px', overflowY: 'auto', ...style }}>
              <Cascader
                defaultValue={form[fieldName]}
                list={itemList}
                labels={titles}
                style={style}
                onChange={data => {
                  this.cascaderChangeHandle(fieldName, data);
                  change(form[fieldName] || '');
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
              onClear={() => this.inputCascaderClearHandle(fieldName)}
            ></el-input>
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
      const { label, fieldName, labelWidth, labelOptions, dateType = 'date', style = {}, disabled, change = () => {} } = option;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-date-picker
            type={dateType.replace('exact', '')}
            v-model={form[fieldName]}
            value-format={conf[dateType].valueFormat}
            placeholder={conf[dateType].placeholder}
            disabled={disabled}
            style={{ ...style }}
            onChange={change}
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
      const { label, fieldName, labelWidth, labelOptions, dateType = 'daterange', style = {}, disabled, change = () => {} } = option;
      const [startDate, endDate] = form[fieldName];
      // 日期区间快捷键方法
      const createPicker = (picker, days) => {
        const end = new Date();
        const start = new Date();
        const f = conf[dateType].valueFormat.replace('yyyy', 'YYYY').replace('dd', 'DD');
        start.setTime(start.getTime() - 3600 * 1000 * 24 * Number(days));
        form[fieldName] = [moment(start).format(f), moment(end).format(f)];
        picker.$emit('pick', start);
      };
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <div class="range-date" style={{ ...style }}>
            <el-date-picker
              type={dateType.replace('exact', '').slice(0, -5)}
              value={form[fieldName][0]}
              onInput={val => {
                val = val === null ? undefined : val;
                form[fieldName] = [val, form[fieldName][1]];
              }}
              pickerOptions={{
                disabledDate(time) {
                  if (!endDate) return;
                  return time.getTime() > moment(endDate).toDate();
                },
                shortcuts: [
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
                  }
                ]
              }}
              value-format={conf[dateType].valueFormat}
              style={{ width: `calc(50% - 7px)` }}
              placeholder={conf[dateType].placeholder[0]}
              disabled={disabled}
              onChange={() => change(form[fieldName])}
            />
            <span class={disabled ? 'is-disabled' : ''} style="display: inline-block; line-height: 26px; text-align: center; width: 14px;">
              -
            </span>
            <el-date-picker
              type={dateType.replace('exact', '').slice(0, -5)}
              value={form[fieldName][1]}
              onInput={val => {
                val = val === null ? undefined : val;
                form[fieldName] = [form[fieldName][0], val];
              }}
              pickerOptions={{
                disabledDate(time) {
                  if (!startDate) return;
                  return time.getTime() < moment(startDate).toDate();
                }
              }}
              value-format={conf[dateType].valueFormat}
              style={{ width: `calc(50% - 7px)` }}
              placeholder={conf[dateType].placeholder[1]}
              disabled={disabled}
              onChange={() => change(form[fieldName])}
            />
          </div>
        </el-form-item>
      );
    },
    // RANGE_DATE(option) {
    //   const { form } = this;
    //   const conf = {
    //     daterange: {
    //       placeholder: ['开始日期', '结束日期'],
    //       valueFormat: 'yyyy-MM-dd HH:mm:ss'
    //     },
    //     datetimerange: {
    //       placeholder: ['开始时间', '结束时间'],
    //       valueFormat: 'yyyy-MM-dd HH:mm:ss'
    //     },
    //     exactdaterange: {
    //       placeholder: ['开始日期', '结束日期'],
    //       valueFormat: 'yyyy-MM-dd'
    //     },
    //     monthrange: {
    //       placeholder: ['开始月份', '结束月份'],
    //       valueFormat: 'yyyy-MM'
    //     }
    //   };
    //   const { label, fieldName, labelWidth, labelOptions, dateType = 'daterange', style = {}, disabled, change = () => {} } = option;
    //   // 日期区间快捷键方法
    //   const createPicker = (picker, days) => {
    //     const end = new Date();
    //     const start = new Date();
    //     start.setTime(start.getTime() - 3600 * 1000 * 24 * Number(days));
    //     picker.$emit('pick', [start, end]);
    //   };
    //   return (
    //     <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
    //       {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
    //       <el-date-picker
    //         type={dateType.replace('exact', '')}
    //         value={form[fieldName]}
    //         onInput={val => {
    //           val = val === null ? [] : val;
    //           form[fieldName] = val;
    //         }}
    //         value-format={conf[dateType].valueFormat}
    //         range-separator="-"
    //         start-placeholder={conf[dateType].placeholder[0]}
    //         end-placeholder={conf[dateType].placeholder[1]}
    //         unlink-panels={true}
    //         disabled={disabled}
    //         style={{ ...style }}
    //         onChange={() => change(form[fieldName])}
    //         pickerOptions={{
    //           shortcuts: [
    //             {
    //               text: '最近一周',
    //               onClick(picker) {
    //                 createPicker(picker, 7);
    //               }
    //             },
    //             {
    //               text: '最近一个月',
    //               onClick(picker) {
    //                 createPicker(picker, 30);
    //               }
    //             },
    //             {
    //               text: '最近三个月',
    //               onClick(picker) {
    //                 createPicker(picker, 90);
    //               }
    //             }
    //           ]
    //         }}
    //       />
    //     </el-form-item>
    //   );
    // },
    CHECKBOX(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, descOptions, options = {}, style = {}, disabled, change = () => {} } = option;
      const { trueValue = '1', falseValue = '0' } = options;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-checkbox v-model={form[fieldName]} disabled={disabled} style={{ ...style }} trueLabel={trueValue} falseLabel={falseValue} onChange={change}></el-checkbox>
          {this.createFormItemDesc(descOptions)}
        </el-form-item>
      );
    },
    MULTIPLE_CHECKBOX(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, descOptions, itemList, style = {}, disabled, change = () => {} } = option;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-checkbox-group v-model={form[fieldName]} style={{ ...style }} onChange={change}>
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
      const { label, fieldName, labelWidth, labelOptions, style = {}, placeholder = '请输入...', disabled, rows = 2, maxlength = 100 } = option;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-input type="textarea" v-model={form[fieldName]} placeholder={placeholder} disabled={disabled} style={{ ...style }} clearable rows={rows} maxlength={maxlength} showWordLimit />
        </el-form-item>
      );
    },
    createSelectHandle(option, multiple = false) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, descOptions, filterable, request = {}, style = {}, placeholder = '请选择...', disabled, change = () => {} } = option;
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
            filterable={filterable}
            v-model={form[fieldName]}
            placeholder={placeholder}
            disabled={disabled}
            style={{ ...style }}
            clearable
            onChange={change}
            nativeOnKeydown={this.enterEventHandle}
            filterMethod={queryString => {
              if (!filterable) return;
              this.filterMethodHandle(fieldName, queryString);
            }}
            on-visible-change={val => {
              if (filterable && !val) {
                setTimeout(() => this.filterMethodHandle(fieldName, ''), 300);
              }
            }}
          >
            {itemList.map(x => (
              <el-option key={x.value} label={x.text} value={x.value} />
            ))}
          </el-select>
          {this.createFormItemDesc(descOptions)}
        </el-form-item>
      );
    },
    // 下拉框的筛选方法
    filterMethodHandle(fieldName, queryString = '') {
      const { itemList = [] } = this.formItemList.find(x => x.fieldName === fieldName) || {};
      if (!this[`${fieldName}OriginItemList`] && !_.isEqual(this[`${fieldName}OriginItemList`], itemList)) {
        this[`${fieldName}OriginItemList`] = itemList;
      }
      const res = queryString ? this[`${fieldName}OriginItemList`].filter(this.createSearchHelpFilter(queryString)) : this[`${fieldName}OriginItemList`];
      this.formItemList.find(x => x.fieldName === fieldName).itemList = res;
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
    treeFilterTextHandle(key) {
      this.$refs[`tree-${key}`].filter(this[`${key}TreeFilterTexts`]);
    },
    // 清空树节点选择器
    treeInputClearHandle(fieldName) {
      this.form[fieldName] = undefined;
      this.$nextTick(() => this.$refs[fieldName].clearValidate());
    },
    // 树结构的筛选方法
    filterNodeHandle(value, data) {
      if (!value) return true;
      return data.text.indexOf(value) !== -1;
    },
    // 树节点单机事件
    treeNodeClickHandle(fieldName, { value }) {
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
    // 清空级联选择器
    inputCascaderClearHandle(fieldName) {
      this.form[fieldName] = undefined;
      this[`${fieldName}CascaderTexts`] = '';
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
    isValidateValue(val) {
      return Array.isArray(val) ? val.length : !!val;
    },
    // 表单数据通过非空校验，返回 true，否则返回 false
    isNotEmptyValidate(form) {
      for (let key in this.rules) {
        if (this.rules[key].some(x => x.required) && !this.isValidateValue(form[key])) {
          return false;
        }
      }
      return true;
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
          let [startTime, endTime] = attr.split('|');
          form[startTime] = form[attr][0];
          form[endTime] = form[attr][1];
        }
      }
    },
    submitForm(ev) {
      ev && ev.preventDefault();
      let isErr;
      this.$refs.form.validate(valid => {
        isErr = !valid;
        if (valid) {
          this.excuteFormData(this.form);
          return this.$emit('filterChange', this.form);
        }
        // 校验没通过，展开
        this.expand = true;
      });
      return isErr;
    },
    resetForm() {
      this.$refs.form.resetFields();
      this.excuteFormData(this.form);
      this.isNotEmptyValidate(this.form) && this.$emit('filterChange', this.form);
      // 解决日期区间(拆分后)重复校验的 bug
      this.$nextTick(() => this.$refs.form.clearValidate());
    },
    toggleHandler() {
      this.expand = !this.expand;
    },
    createButton(rows, total) {
      const { cols, expand, collapse } = this;
      const colSpan = 24 / cols;
      // 默认收起
      let offset = rows * cols - total > 0 ? rows * cols - total - 1 : 0;
      // 展开
      if (expand) {
        offset = cols - (total % cols) - 1;
      }
      return this.isSubmitBtn ? (
        <el-col key="-" span={colSpan} offset={offset * colSpan} style={{ textAlign: 'right' }}>
          <el-button size="small" type="primary" onClick={this.submitForm}>
            搜 索
          </el-button>
          <el-button size="small" onClick={this.resetForm}>
            重 置
          </el-button>
          {collapse ? (
            <el-button size="small" type="text" onClick={this.toggleHandler}>
              {expand ? '收起' : '展开'} <i class={expand ? 'el-icon-arrow-up' : 'el-icon-arrow-down'} />
            </el-button>
          ) : null}
        </el-col>
      ) : null;
    },
    createFormLayout() {
      const { cols, rows, expand, collapse } = this;
      const colSpan = 24 / cols;
      const formItems = this.createFormItem().filter(item => item !== null);
      const defaultPlayRows = rows > Math.ceil(formItems.length / cols) ? Math.ceil(formItems.length / cols) : rows;
      const count = expand ? formItems.length : defaultPlayRows * cols - 1;
      const colFormItems = formItems.map((Node, i) => {
        return (
          <el-col key={i} span={colSpan} style={{ display: !collapse || i < count ? 'block' : 'none' }}>
            {Node}
          </el-col>
        );
      });
      return [...colFormItems, this.createButton(defaultPlayRows, formItems.length)];
    },
    // 函数防抖
    debounce(fn, delay) {
      return function(...args) {
        fn.timer && clearTimeout(fn.timer);
        fn.timer = setTimeout(() => fn.apply(this, args), delay);
      };
    },
    difference(newVal, oldVal) {
      const res = {};
      for (let key in newVal) {
        if (!_.isEqual(newVal[key], oldVal[key])) {
          res[key] = newVal[key];
        }
      }
      return res;
    },
    deepFind(arr, mark) {
      let res = null;
      for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i].children)) {
          res = this.deepFind(arr[i].children, mark);
        }
        if (res !== null) {
          return res;
        }
        if (arr[i].value === mark) {
          res = arr[i];
          break;
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
    async GET_FORM_DATA() {
      try {
        await this.$refs.form.validate();
        this.excuteFormData(this.form);
        return [false, this.form];
      } catch (err) {
        return [true, null];
      }
    }
  },
  render() {
    const { form, rules, labelWidth } = this;
    return (
      <div class="top-filter">
        <el-form ref="form" size="small" model={form} rules={rules} label-width={`${labelWidth}px`}>
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
    height: 32px;
    margin-bottom: 12px;
    .el-form-item {
      margin-bottom: 0;
      .label-wrap {
        display: inline-block;
        width: calc(100% - 10px);
        .el-input__inner {
          border-color: @borderColor;
          padding: 0 8px;
          & + span.el-input__suffix {
            right: 0;
          }
        }
      }
      .el-form-item__label {
        height: 32px;
        font-size: @textSizeSecondary;
        padding-right: @modulePadding;
      }
      .el-form-item__content {
        line-height: 30px;
        .el-input__inner {
          line-height: 32px;
          line-height: 30px\0;
        }
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
            line-height: 30px;
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
        .el-textarea__inner {
          font-family: inherit;
          overflow-y: auto;
        }
        .el-input__count {
          line-height: 12px;
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
        padding-left: @modulePadding;
      }
      &.is-error {
        .range-date {
          border-color: #f5222d;
        }
      }
    }
  }
}
</style>
