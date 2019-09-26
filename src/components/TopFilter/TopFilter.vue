<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-05-06 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-08-15 16:28:04
 **/
import _ from 'lodash';
import pinyin from 'pinyin';
import moment from 'moment';
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
    this.arrayTypes = ['RANGE_DATE', 'MULTIPLE_SELECT', 'MULTIPLE_CHECKBOX'];
    return {
      expand: false, // 展开收起状态
      treeFilterText: '',
      popoverVisible: false,
      cascaderVisible: false,
      form: {},
      rules: this.createFormRule()
    };
  },
  created() {
    this.form = this.createFormData();
    this.prevForm = { ...this.form };
  },
  computed: {
    formOptions() {
      const res = [];
      this.list.forEach(x => {
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
              this.form[x.fieldName] = x.initialValue;
              // 对组件外 js 动态赋值的表单元素进行校验
              this.$refs.form.validateField(x.fieldName);
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
    expand(val) {
      if (!this.collapse) return;
      this.$emit('onCollapse', val);
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
      if (this.arrayTypes.includes(type)) {
        initialValue = initialValue || [];
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
    createFormRule() {
      const target = {};
      this.list.forEach(x => {
        if (!x.fieldName) return;
        target[x.fieldName] = x.rules;
      });
      return target;
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
    INPUT(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, descOptions, style = {}, placeholder, unitRender, readonly, disabled, change = () => {}, onFocus = () => {} } = option;
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
      const {
        label,
        fieldName,
        labelWidth,
        labelOptions,
        descOptions,
        style = {},
        placeholder,
        disabled,
        min = 0,
        max = 99999999,
        step = 1,
        precision,
        change = () => {},
        onFocus = () => {}
      } = option;
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
            clearable
            precision={precision}
            onChange={change}
            onFocus={onFocus}
            nativeOnKeydown={this.enterEventHandle}
          ></el-input-number>
          {this.createFormItemDesc(descOptions)}
        </el-form-item>
      );
    },
    INPUT_TREE(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, itemList, style = {}, placeholder, readonly, disabled, change = () => {} } = option;
      return (
        <el-form-item key={fieldName} ref={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
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
              nativeOnKeydown={this.enterEventHandle}
            ></el-input>
          </el-popover>
        </el-form-item>
      );
    },
    INPUT_CASCADER(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, itemList = [], options = {}, style = {}, placeholder, readonly, disabled, change = () => {} } = option;
      const { titles = [] } = options;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
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
      const { label, fieldName, labelWidth, labelOptions, request = {}, style = {}, placeholder, disabled, change = () => {} } = option;
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
      const { label, fieldName, labelWidth, itemList, labelOptions, style = {}, placeholder, disabled, change = () => {} } = option;
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
      const { label, fieldName, labelWidth, labelOptions, valueFormat = 'yyyy-MM-dd HH:mm:ss', style = {}, placeholder, disabled } = option;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-date-picker type="date" v-model={form[fieldName]} value-format={valueFormat} placeholder={placeholder} disabled={disabled} style={{ ...style }} />
        </el-form-item>
      );
    },
    DATE_TIME(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, valueFormat = 'yyyy-MM-dd HH:mm:ss', style = {}, placeholder, disabled } = option;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-date-picker type="datetime" v-model={form[fieldName]} value-format={valueFormat} placeholder={placeholder} disabled={disabled} style={{ ...style }} />
        </el-form-item>
      );
    },
    RANGE_DATE(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, valueFormat = 'yyyy-MM-dd HH:mm:ss', style = {}, disabled } = option;
      const [startDate, endDate] = form[fieldName];
      // 日期区间快捷键方法
      const createPicker = (picker, days) => {
        const end = new Date();
        const start = new Date();
        const f = valueFormat.replace('yyyy-MM-dd', 'YYYY-MM-DD');
        start.setTime(start.getTime() - 3600 * 1000 * 24 * Number(days));
        form[fieldName] = [moment(start).format(f), moment(end).format(f)];
        picker.$emit('pick', start);
      };
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <div class="range-date" style={{ ...style }}>
            <el-date-picker
              type="date"
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
                  }
                ]
              }}
              value-format={valueFormat}
              style={{ width: `calc(50% - 7px)` }}
              placeholder="开始日期"
              disabled={disabled}
            />
            <span class={disabled ? 'is-disabled' : ''} style="display: inline-block; line-height: 26px; text-align: center; width: 14px;">
              -
            </span>
            <el-date-picker
              type="date"
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
              value-format={valueFormat}
              style={{ width: `calc(50% - 7px)` }}
              placeholder="结束日期"
              disabled={disabled}
            />
          </div>
        </el-form-item>
      );
    },
    // RANGE_DATE(option) {
    //   const { form } = this;
    //   const { label, fieldName, labelWidth, labelOptions, valueFormat = 'yyyy-MM-dd HH:mm:ss', style = {}, disabled } = option;
    //   return (
    //     <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
    //       {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
    //       <el-date-picker
    //         type="daterange"
    //         value={form[fieldName]}
    //         onInput={val => {
    //           val = val === null ? [] : val;
    //           form[fieldName] = val;
    //         }}
    //         value-format={valueFormat}
    //         range-separator="-"
    //         start-placeholder="开始日期"
    //         end-placeholder="结束日期"
    //         unlink-panels={true}
    //         disabled={disabled}
    //         style={{ ...style }}
    //         pickerOptions={this.pickerOptions}
    //       />
    //     </el-form-item>
    //   );
    // },
    CHECKBOX(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, descOptions, options = {}, style = {}, placeholder, disabled, change = () => {} } = option;
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
      const { label, fieldName, labelWidth, labelOptions, descOptions, itemList, style = {}, placeholder, disabled, change = () => {} } = option;
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
    TEXT_AREA(option) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, style = {}, placeholder, disabled, rows = 2, maxlength = 100 } = option;
      return (
        <el-form-item key={fieldName} label={label} labelWidth={labelWidth} prop={fieldName}>
          {labelOptions && <span slot="label">{this.createFormItemLabel(labelOptions)}</span>}
          <el-input type="textarea" v-model={form[fieldName]} placeholder={placeholder} disabled={disabled} style={{ ...style }} clearable rows={rows} maxlength={maxlength} showWordLimit />
        </el-form-item>
      );
    },
    createSelectHandle(option, multiple = false) {
      const { form } = this;
      const { label, fieldName, labelWidth, labelOptions, descOptions, filterable, request = {}, style = {}, placeholder, disabled, change = () => {} } = option;
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
          {this.createFormItemDesc(descOptions)}
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
    // 创建搜索帮助数据列表
    createSerachHelperList(list, valueKey) {
      return list.map(x => ({ value: x[valueKey] }));
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
    // 创建树节点的值
    createInputTreeValue(fieldName, itemList) {
      let { text = '' } = this.deepFind(itemList, this.form[fieldName]) || {};
      return text;
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
        return VNode;
      });
    },
    enterEventHandle(ev) {
      if (ev.keyCode !== 13) return;
      this.submitForm(ev);
    },
    excuteFormData(form) {
      this.formOptions
        .filter(x => x.type === 'RANGE_DATE')
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
      this.excuteFormData(this.form);
      this.$refs.form.validate(valid => {
        if (valid) {
          return this.$emit('filterChange', this.form);
        }
        // 校验没通过，展开
        this.expand = true;
        return false;
      });
    },
    resetForm() {
      this.$refs.form.resetFields();
      this.excuteFormData(this.form);
      this.$emit('filterChange', this.form);
      this.$nextTick(() => this.$refs.form.clearValidate());
    },
    toggleHandler() {
      this.expand = !this.expand;
    },
    createButton(n, total) {
      const { cols, expand, collapse } = this;
      const colSpan = 24 / cols;
      let offset = ((cols - (n % cols)) % cols) * colSpan;
      if (!expand && total < cols) {
        offset = (cols - total - 1) * colSpan;
      }
      return this.isSubmitBtn ? (
        <el-col key="-" span={colSpan} offset={offset} style={{ textAlign: 'right' }}>
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
      const { cols, expand, collapse } = this;
      const colSpan = 24 / cols;
      const formItems = this.createFormItem().filter(item => item !== null);
      const count = expand ? formItems.length : cols - 1;
      const colFormItems = formItems.map((Node, i) => {
        return (
          <el-col key={i} span={colSpan} style={{ display: !collapse || i < count ? 'block' : 'none' }}>
            {Node}
          </el-col>
        );
      });
      return [...colFormItems, this.createButton(count + 1, formItems.length)];
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
      .desc-icon {
        padding: 6px;
        font-size: 18px;
        vertical-align: middle;
      }
      .desc-text {
        font-size: @textSizeSecondary;
        padding-left: @modulePadding;
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
      &.is-error {
        .range-date {
          border-color: #f5222d;
        }
      }
    }
  }
}
</style>
