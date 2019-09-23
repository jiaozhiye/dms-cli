<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-05-06 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-08-18 12:02:51
 **/
import _ from 'lodash';
import pinyin from 'pinyin';
import Cascader from './Cascader.vue';
import BreakSpace from '@/components/BreakSpace/BreakSpace.vue';
import UploadCropper from '@/components/UploadCropper/UploadCropper.vue';

export default {
  name: 'FormPanel',
  props: {
    list: {
      type: Array,
      required: true
    },
    formType: {
      type: String,
      default: 'add'
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
      default: true
    }
  },
  data() {
    const createPicker = (picker, days) => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * Number(days));
      picker.$emit('pick', [start, end]);
    };
    this.pickerOptions = {
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
        },
        {
          text: '最近半年',
          onClick(picker) {
            createPicker(picker, 180);
          }
        },
        {
          text: '最近一年',
          onClick(picker) {
            createPicker(picker, 365);
          }
        }
      ]
    };
    this.treeProps = {
      children: 'children',
      label: 'text'
    };
    this.prevForm = null;
    this.arrayTypes = ['RANGE_DATE', 'RANGE_INPUT_NUMBER', 'MULTIPLE_SELECT', 'MULTIPLE_CHECKBOX', 'UPLOAD_IMG', 'UPLOAD_FILE'];
    return {
      treeFilterText: '',
      popoverVisible: false,
      cascaderVisible: false,
      form: {},
      rules: this.createFormRule(this.list)
    };
  },
  created() {
    this.form = this.createFormData();
    this.prevForm = { ...this.form };
  },
  computed: {
    fieldNames() {
      return this.list.map(x => x.fieldName).filter(x => !!x);
    },
    formOptions() {
      const res = [];
      this.list.forEach(x => {
        if (x.type === 'BREAK_SPACE') return;
        if (x.labelOptions) {
          res.push(x.labelOptions);
        }
        res.push(x);
      });
      return res;
    }
  },
  watch: {
    formOptions: {
      handler(nextProps) {
        this.$nextTick(() => {
          nextProps.forEach(x => {
            if (!_.isEqual(x.initialValue, this.form[x.fieldName])) {
              let { initialValue, type = '', fieldName } = x;
              if (this.arrayTypes.includes(type)) {
                initialValue = initialValue || [];
              }
              if (type === 'INPUT' && x.numberFormat) {
                initialValue = this.formatNumber(initialValue);
              }
              this.form[fieldName] = initialValue;
              // 对组件外 js 动态赋值的表单元素进行校验
              this.$refs.form.validateField(fieldName);
            }
          });
        });
      },
      deep: true
    },
    form: {
      handler(nextProps) {
        const res = this.difference(nextProps, this.prevForm);
        if (!Object.keys(res).length) return;
        for (let key in res) {
          let target = this.formOptions.find(x => x.fieldName === key);
          if (!target) continue;
          target.initialValue = res[key];
        }
        this.prevForm = { ...nextProps };
      },
      deep: true
    },
    fieldNames() {
      this.rules = this.createFormRule(this.list);
      this.$nextTick(() => this.$refs.form.clearValidate());
    },
    treeFilterText(val) {
      this.$refs.tree.filter(val);
    },
    popoverVisible(val) {
      if (!val) {
        this.treeFilterText = '';
      }
    }
  },
  methods: {
    getInitialValue(item) {
      let { initialValue, type = '', fieldName } = item;
      if (this.formType === 'show') {
        item.disabled = true;
      }
      if (this.arrayTypes.includes(type)) {
        initialValue = initialValue || [];
      }
      if (type === 'INPUT' && item.numberFormat) {
        initialValue = this.formatNumber(initialValue);
      }
      // 级联选择器
      if (type === 'INPUT_CASCADER') {
        this[`${fieldName}CascaderTexts`] = ''; // 默认值
      }
      return initialValue;
    },
    createFormData() {
      const target = {};
      this.formOptions.forEach(x => {
        const val = this.getInitialValue(x);
        // 设置 initialValue 为响应式数据
        this.$set(x, 'initialValue', val);
        // 初始值
        target[x.fieldName] = val;
      });
      return target;
    },
    createFormRule(list) {
      const target = {};
      list.forEach(x => {
        if (!x.fieldName) return;
        target[x.fieldName] = x.rules;
      });
      return target;
    },
    createFormItemLabel(option) {
      const { form } = this;
      const { fieldName, itemList, style = {}, disabled, change = () => {} } = option;
      return (
        <div class="label-wrap">
          <el-select v-model={form[fieldName]} placeholder={''} disabled={disabled} style={{ ...style }} onChange={change}>
            {itemList.map(x => (
              <el-option key={x.value} label={x.text} value={x.value} />
            ))}
          </el-select>
        </div>
      );
    },
    INPUT(option) {
      const { form } = this;
      const {
        label,
        fieldName,
        labelOptions,
        style = {},
        placeholder,
        unitRender,
        minlength = 0,
        maxlength = 999,
        pattern,
        readonly,
        disabled,
        change = () => {},
        onFocus = () => {},
        onEnter
      } = option;
      const prevValue = form[fieldName];
      return (
        <el-form-item key={fieldName} label={label} prop={fieldName}>
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
            }}
            minlength={minlength}
            maxlength={maxlength}
            placeholder={placeholder}
            readonly={readonly}
            disabled={disabled}
            style={{ ...style }}
            clearable
            onChange={change}
            onFocus={onFocus}
            nativeOnKeydown={e => this.keydownHandle(e, onEnter)}
          >
            {unitRender && <template slot="append">{<div style={disabled && { pointerEvents: 'none' }}>{unitRender()}</div>}</template>}
          </el-input>
        </el-form-item>
      );
    },
    INPUT_NUMBER(option) {
      const { form } = this;
      const { label, fieldName, labelOptions, style = {}, placeholder, disabled, min = 0, max = 99999999, step = 1, precision, change = () => {}, onFocus = () => {} } = option;
      return (
        <el-form-item key={fieldName} label={label} prop={fieldName}>
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
            clearable
            precision={precision}
            onChange={change}
            onFocus={onFocus}
          ></el-input-number>
        </el-form-item>
      );
    },
    RANGE_INPUT_NUMBER(option) {
      const { form } = this;
      const { label, fieldName, labelOptions, min = 0, max = 99999999, step = 1, pattern, readonly, disabled, change = () => {} } = option;
      const [startVal, endVal] = form[fieldName];
      return (
        <el-form-item key={fieldName} label={label} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-input-number
            v-model={form[fieldName][0]}
            controls-position="right"
            min={min}
            max={endVal}
            step={step}
            readonly={readonly}
            disabled={disabled}
            style={{ width: `calc(50% - 7px)` }}
            clearable
            onChange={change}
          />
          <span style="display: inline-block; text-align: center; width: 14px;">-</span>
          <el-input-number
            v-model={form[fieldName][1]}
            controls-position="right"
            min={startVal}
            max={max}
            step={step}
            readonly={readonly}
            disabled={disabled}
            style={{ width: `calc(50% - 7px)` }}
            clearable
            onChange={change}
          />
        </el-form-item>
      );
    },
    INPUT_TREE(option) {
      const { form } = this;
      const { label, fieldName, labelOptions, itemList, style = {}, placeholder, readonly, disabled, change = () => {} } = option;
      return (
        <el-form-item key={fieldName} label={label} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-popover v-model={this.popoverVisible} visibleArrow={false} placement="bottom-start" trigger="click">
            <div class="el-input--small" style={{ maxHeight: '250px', overflowY: 'auto', ...style }}>
              <input v-model={this.treeFilterText} class="el-input__inner" placeholder="树节点过滤"></input>
              <el-tree
                ref="tree"
                style={{ marginTop: '4px' }}
                data={itemList}
                props={this.treeProps}
                defaultExpandAll={true}
                expandOnClickNode={false}
                filterNodeMethod={this.filterNodeHandle}
                on-node-click={data => this.treeNodeClickHandle(fieldName, data)}
              ></el-tree>
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
            ></el-input>
          </el-popover>
        </el-form-item>
      );
    },
    INPUT_CASCADER(option) {
      const { form } = this;
      const { label, fieldName, labelOptions, itemList = [], options = {}, style = {}, placeholder, readonly, disabled, change = () => {} } = option;
      const { titles = [] } = options;
      return (
        <el-form-item key={fieldName} label={label} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-popover v-model={this.cascaderVisible} visibleArrow={false} placement="bottom-start" trigger="click">
            <div style={{ maxHeight: '250px', overflowY: 'auto', ...style }}>
              <Cascader defaultValue={form[fieldName]} list={itemList} labels={titles} style={style} onChange={data => this.cascaderChangeHandle(fieldName, data)} onClose={this.closeCascaderHandle} />
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
              onChange={change}
            ></el-input>
          </el-popover>
        </el-form-item>
      );
    },
    SEARCH_HELPER(option) {
      const { form } = this;
      const { label, fieldName, labelOptions, request = {}, style = {}, placeholder, disabled, change = () => {} } = option;
      return (
        <el-form-item key={fieldName} label={label} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-autocomplete
            v-model={form[fieldName]}
            placeholder={placeholder}
            disabled={disabled}
            style={{ ...style }}
            clearable
            onChange={change}
            fetchSuggestions={(queryString, cb) => this.querySearchAsync(request, fieldName, queryString, cb)}
          />
        </el-form-item>
      );
    },
    SEARCH_HELPER_WEB(option) {
      const { form } = this;
      const { label, fieldName, itemList, labelOptions, style = {}, placeholder, disabled, change = () => {} } = option;
      return (
        <el-form-item key={fieldName} label={label} prop={fieldName}>
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
      const { label, fieldName, labelOptions, valueFormat = 'yyyy-MM-dd HH:mm:ss', style = {}, placeholder, disabled, change = () => {} } = option;
      return (
        <el-form-item key={fieldName} label={label} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-date-picker type="date" v-model={form[fieldName]} value-format={valueFormat} placeholder={placeholder} disabled={disabled} style={{ ...style }} onChange={change} />
        </el-form-item>
      );
    },
    DATE_TIME(option) {
      const { form } = this;
      const { label, fieldName, labelOptions, valueFormat = 'yyyy-MM-dd HH:mm:ss', style = {}, placeholder, disabled, change = () => {} } = option;
      return (
        <el-form-item key={fieldName} label={label} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-date-picker type="datetime" v-model={form[fieldName]} value-format={valueFormat} placeholder={placeholder} disabled={disabled} style={{ ...style }} onChange={change} />
        </el-form-item>
      );
    },
    RANGE_DATE(option) {
      const { form } = this;
      const { label, fieldName, labelOptions, valueFormat = 'yyyy-MM-dd HH:mm:ss', style = {}, disabled } = option;
      return (
        <el-form-item key={fieldName} label={label} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-date-picker
            type="daterange"
            value={form[fieldName]}
            onInput={val => {
              val = val === null ? [] : val;
              form[fieldName] = val;
            }}
            value-format={valueFormat}
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            unlink-panels={true}
            disabled={disabled}
            style={{ ...style }}
            pickerOptions={this.pickerOptions}
          />
        </el-form-item>
      );
    },
    TIME(option) {
      const { form } = this;
      const { label, fieldName, labelOptions, valueFormat = 'HH:mm:ss', style = {}, placeholder, disabled, change = () => {} } = option;
      return (
        <el-form-item key={fieldName} label={label} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-time-picker
            v-model={form[fieldName]}
            pickerOptions={{
              format: valueFormat
            }}
            value-format={valueFormat}
            placeholder={placeholder}
            disabled={disabled}
            style={{ ...style }}
            onChange={change}
          />
        </el-form-item>
      );
    },
    RANGE_TIME(option) {
      const { form } = this;
      const { label, fieldName, labelOptions, valueFormat = 'HH:mm:ss', style = {}, disabled, change = () => {} } = option;
      return (
        <el-form-item key={fieldName} label={label} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-time-picker
            isRange={true}
            v-model={form[fieldName]}
            pickerOptions={{
              format: valueFormat
            }}
            value-format={valueFormat}
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            disabled={disabled}
            style={{ ...style }}
            onChange={change}
          />
        </el-form-item>
      );
    },
    TIME_SELECT(option) {
      const { form } = this;
      const { label, fieldName, labelOptions, valueFormat = 'HH:mm', options = {}, style = {}, placeholder, disabled, change = () => {} } = option;
      const { startTime = '00:00', endTime = '23:45', stepTime = '00:15' } = options;
      return (
        <el-form-item key={fieldName} label={label} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-time-select
            v-model={form[fieldName]}
            pickerOptions={{
              format: valueFormat,
              start: startTime,
              end: endTime,
              step: stepTime
            }}
            value-format={valueFormat}
            placeholder={placeholder}
            disabled={disabled}
            style={{ ...style }}
            onChange={change}
          />
        </el-form-item>
      );
    },
    CHECKBOX(option) {
      const { form } = this;
      const { label, fieldName, labelOptions, options = {}, style = {}, placeholder, disabled, change = () => {} } = option;
      const { trueValue = '1', falseValue = '0' } = options;
      return (
        <el-form-item key={fieldName} label={label} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-checkbox v-model={form[fieldName]} disabled={disabled} style={{ ...style }} trueLabel={trueValue} falseLabel={falseValue} onChange={change}></el-checkbox>
        </el-form-item>
      );
    },
    MULTIPLE_CHECKBOX(option) {
      const { form } = this;
      const { label, fieldName, labelOptions, itemList, style = {}, placeholder, disabled, change = () => {} } = option;
      return (
        <el-form-item key={fieldName} label={label} prop={fieldName}>
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
        </el-form-item>
      );
    },
    RADIO(option) {
      const { form } = this;
      const { label, fieldName, labelOptions, itemList, style = {}, placeholder, disabled, change = () => {} } = option;
      return (
        <el-form-item key={fieldName} label={label} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-radio-group v-model={form[fieldName]} style={{ ...style }} onChange={change}>
            {itemList.map(x => (
              <el-radio key={x.value} label={x.value} disabled={disabled}>
                {x.text}
              </el-radio>
            ))}
          </el-radio-group>
        </el-form-item>
      );
    },
    TEXT_AREA(option) {
      const { form } = this;
      const { label, fieldName, labelOptions, style = {}, placeholder, disabled, rows = 2, maxlength = 100 } = option;
      return (
        <el-form-item key={fieldName} label={label} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-input type="textarea" v-model={form[fieldName]} placeholder={placeholder} disabled={disabled} style={{ ...style }} clearable rows={rows} maxlength={maxlength} showWordLimit />
        </el-form-item>
      );
    },
    UPLOAD_IMG(option) {
      const { form } = this;
      const { label, fieldName, labelOptions, upload = {}, style = {}, placeholder, disabled } = option;
      return (
        <el-form-item key={fieldName} label={label} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <UploadCropper
            actionUrl={upload.actionUrl}
            initialValue={form[fieldName]}
            style={{ ...style }}
            fixedSize={upload.fixedSize}
            isCalcHeight={upload.isCalcHeight}
            limit={upload.limit || 1}
            titles={upload.titles}
            tipText={upload.tipText}
            disabled={disabled}
            onSuccess={val => {
              this.form[fieldName] = val;
              this.$refs.form.validateField(fieldName);
            }}
          />
        </el-form-item>
      );
    },
    UPLOAD_FILE(option) {
      const { form } = this;
      const { label, fieldName, labelOptions, upload = {}, style = {}, placeholder, disabled } = option;
      let { actionUrl, limit = 1, tipText } = upload;
      tipText = !tipText ? '' : `${tipText}，`;
      const uploadProps = {
        props: {
          action: actionUrl,
          fileList: form[fieldName],
          limit,
          multiple: false,
          withCredentials: true,
          disabled,
          beforeUpload: this.beforeUploadHandle,
          onRemove: (file, fileList) => this.handleRemove(fieldName, file, fileList),
          onSuccess: (res, file, fileList) => this.successHandle(fieldName, res, file, fileList)
        }
      };
      return (
        <el-form-item key={fieldName} label={label} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-upload ref="upload-file" {...uploadProps} style={{ ...style }}>
            <el-button size="small" type="primary">
              点击上传
            </el-button>
            <div slot="tip" class="el-upload__tip">
              {`${tipText}文件大小不超过5M`}
            </div>
          </el-upload>
        </el-form-item>
      );
    },
    BREAK_SPACE(option) {
      const { label = '标题', style = {} } = option;
      return <BreakSpace label={label} labelStyle={style} />;
    },
    createSelectHandle(option, multiple = false) {
      const { form } = this;
      const { label, fieldName, labelOptions, filterable, request = {}, style = {}, placeholder, disabled, change = () => {} } = option;
      const { fetchApi, params = {} } = request;
      let { itemList } = option;
      if (!itemList && fetchApi) {
        itemList = this[`${fieldName}ItemList`] || [];
        if (!_.isEqual(this[`${fieldName}PrevParams`], params)) {
          this[`${fieldName}PrevParams`] = params;
          this.querySelectOptions(request, fieldName);
        }
      }
      return (
        <el-form-item key={fieldName} label={label} prop={fieldName}>
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
            filterMethod={queryString => this.filterMethodHandle(fieldName, queryString)}
            on-visible-change={ev => {
              if (!filterable && ev) return;
              setTimeout(() => this.filterMethodHandle(fieldName, ''), 300);
            }}
          >
            {itemList.map(x => (
              <el-option key={x.value} label={x.text} value={x.value} />
            ))}
          </el-select>
        </el-form-item>
      );
    },
    // 下拉框的筛选方法
    filterMethodHandle(fieldName, queryString = '') {
      const { itemList = [] } = this.formOptions.find(x => x.fieldName === fieldName) || {};
      if (!this[`${fieldName}OriginItemList`] && !_.isEqual(this[`${fieldName}OriginItemList`], itemList)) {
        this[`${fieldName}OriginItemList`] = itemList;
      }
      const res = queryString ? this[`${fieldName}OriginItemList`].filter(this.createSearchHelpFilter(queryString)) : this[`${fieldName}OriginItemList`];
      this.formOptions.find(x => x.fieldName === fieldName).itemList = res;
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
    querySearchHandle(fieldName, queryString = '', cb) {
      const { itemList = [] } = this.formOptions.find(x => x.fieldName === fieldName) || {};
      const res = queryString ? itemList.filter(this.createSearchHelpFilter(queryString)) : itemList;
      cb(res);
    },
    createSearchHelpFilter(queryString) {
      return state => {
        const pyt = pinyin(state.text, { style: pinyin.STYLE_FIRST_LETTER })
          .flat()
          .join('');
        const str = `${state.text}|${pyt}`;
        return str.toLowerCase().includes(queryString.toLowerCase());
      };
    },
    // 创建搜索帮助数据列表
    createSerachHelperList(list, valueKey) {
      return list.map(x => ({ value: x[valueKey] }));
    },
    // 文件上传之前的校验
    beforeUploadHandle(file) {
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$notify({ title: '警告信息', message: '上传附件大小不能超过 5MB!', type: 'warning' });
      }
      return isLt5M;
    },
    // 创建上传文件列表
    createFileList(fieldName, name, url = '') {
      this.form[fieldName].push({ name, url });
    },
    // 文件上传成功
    successHandle(fieldName, res, file, fileList) {
      if (res.resultCode === 200) {
        this.createFileList(fieldName, file.name, res.data);
      }
    },
    // 文件被移除
    handleRemove(fieldName, file, fileList) {
      this.form[fieldName] = fileList;
    },
    // 创建树节点的值
    createInputTreeValue(fieldName, itemList) {
      let { text = '' } = this.deepFind(itemList, this.form[fieldName]) || {};
      return text;
    },
    // 清空树节点选择器
    treeInputClearHandle(fieldName) {
      this.form[fieldName] = undefined;
    },
    // 树结构的筛选方法
    filterNodeHandle(value, data) {
      if (!value) return true;
      return data.text.indexOf(value) !== -1;
    },
    // 树节点单机事件
    treeNodeClickHandle(fieldName, { value }) {
      this.form[fieldName] = value;
      this.popoverVisible = false;
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
    // 关闭级联选择器下拉面板方法
    closeCascaderHandle(val) {
      this.cascaderVisible = val;
    },
    createFormItem() {
      return this.list.map(item => {
        const VNode = !this[item.type] ? null : this[item.type](item);
        VNode['type'] = item.type;
        VNode['cols'] = item.selfCols;
        VNode['offsetLeft'] = item.offsetLeftCols;
        VNode['offsetRight'] = item.offsetRightCols;
        return VNode;
      });
    },
    keydownHandle(e, callback) {
      if (e.keyCode !== 13) return;
      callback && callback(e.target.value);
    },
    excuteFormData(form) {
      this.formOptions
        .filter(x => x.type === 'RANGE_INPUT_NUMBER')
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
      this.excuteFormData(this.form);
      this.$refs.form.validate(valid => {
        if (valid) {
          return this.$emit('formChange', this.form);
        }
        return false;
      });
    },
    resetForm() {
      this.$refs.form.resetFields();
      this.excuteFormData(this.form);
    },
    createFormLayout() {
      const colSpan = 24 / this.cols;
      const formItems = this.createFormItem().filter(item => item !== null);
      const colFormItems = formItems.map((Node, i) => {
        const spans = _.isUndefined(Node.cols) ? colSpan : Node.cols * colSpan;
        const offsetLeft = _.isUndefined(Node.offsetLeft) ? 0 : Node.offsetLeft * colSpan;
        const offsetRight = _.isUndefined(Node.offsetRight) ? 0 : this.toPercent(Node.offsetRight / this.cols);
        return (
          <el-col key={i} offset={offsetLeft} span={Node.type !== 'BREAK_SPACE' ? spans : 24} style={{ marginRight: offsetRight }}>
            {Node}
          </el-col>
        );
      });
      return colFormItems;
    },
    createFormButton() {
      const colSpan = 24 / this.cols;
      return this.isSubmitBtn && this.formType !== 'show' ? (
        <el-row gutter={10}>
          <el-col key="-" span={colSpan}>
            <el-form-item label={''}>
              <el-button size="small" type="primary" onClick={this.submitForm}>
                {this.formType === 'add' ? '保 存' : '修 改'}
              </el-button>
              <el-button size="small" onClick={this.resetForm}>
                重 置
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      ) : null;
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
    toPercent(num) {
      return Number(num * 100).toFixed(5) + '%';
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
    SUBMIT_FORM(ev) {
      this.submitForm(ev);
    },
    RESET_FORM() {
      this.resetForm();
    }
  },
  render() {
    const { form, rules, labelWidth } = this;
    return (
      <div class="form-panel">
        <el-form ref="form" size="small" model={form} rules={rules} label-width={`${labelWidth}px`}>
          <el-row gutter={10}>{this.createFormLayout()}</el-row>
          {this.createFormButton()}
        </el-form>
      </div>
    );
  }
};
</script>

<style lang="less">
.form-panel {
  .el-col {
    min-height: 32px;
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
      .el-form-item__content {
        line-height: 30px;
        .el-form-item__error {
          margin-top: -2px;
          transform-origin: 0 50%;
          -webkit-transform: scale(0.9);
          transform: scale(0.9);
        }
      }
      .el-form-item__label {
        font-size: @textSizeSecondary;
        padding-right: @modulePadding;
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
      .el-textarea {
        .el-textarea__inner {
          font-family: inherit;
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
    }
  }
}
</style>
