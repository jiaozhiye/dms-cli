<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-05-06 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-08-15 16:28:04
 **/
import _ from 'lodash';

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
      form: this.createFormData(this.list),
      rules: this.createFormRule(this.list)
    };
  },
  created() {
    this.prevForm = { ...this.form };
  },
  watch: {
    list: {
      handler(val) {
        this.$nextTick(() => {
          val.forEach(x => {
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
      handler(val) {
        const res = this.difference(val, this.prevForm);
        if (!Object.keys(res).length) return;
        for (let key in res) {
          this.list.find(x => x.fieldName === key).initialValue = res[key];
        }
        this.prevForm = { ...val };
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
    createFormData(list) {
      const target = {};
      list.forEach(x => {
        let { initialValue, type, fieldName } = x;
        if (this.arrayTypes.includes(type)) {
          initialValue = initialValue || [];
        }
        // 设置 initialValue 为响应式数据
        this.$set(x, 'initialValue', initialValue);
        // 初始值
        target[fieldName] = initialValue;
      });
      return target;
    },
    createFormRule(list) {
      const target = {};
      list.forEach(x => {
        target[x.fieldName] = x.rules;
      });
      return target;
    },
    INPUT(option) {
      const { form } = this;
      const { label, fieldName, style = {}, placeholder, unitRender, readonly, disabled, change = () => {}, onFocus = () => {} } = option;
      return (
        <el-form-item key={fieldName} label={label} prop={fieldName}>
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
        </el-form-item>
      );
    },
    INPUT_NUMBER(option) {
      const { form } = this;
      const { label, fieldName, style = {}, placeholder, disabled, min = 0, max = 99999999, step = 1, precision, change = () => {}, onFocus = () => {} } = option;
      return (
        <el-form-item key={fieldName} label={label} prop={fieldName}>
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
        </el-form-item>
      );
    },
    INPUT_TREE(option) {
      const { form } = this;
      const { label, fieldName, itemList, style = {}, placeholder, readonly, disabled, change = () => {} } = option;
      return (
        <el-form-item key={fieldName} ref={fieldName} label={label} prop={fieldName}>
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
    SEARCH_HELPER(option) {
      const { form } = this;
      const { label, fieldName, request = {}, style = {}, placeholder, disabled, change = () => {} } = option;
      return (
        <el-form-item key={fieldName} label={label} prop={fieldName}>
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
    SELECT(option) {
      return this.createSelectHandle(option);
    },
    MULTIPLE_SELECT(option) {
      return this.createSelectHandle(option, true);
    },
    DATE(option) {
      const { form } = this;
      const { label, fieldName, valueFormat = 'yyyy-MM-dd HH:mm:ss', style = {}, placeholder, disabled } = option;
      return (
        <el-form-item key={fieldName} label={label} prop={fieldName}>
          <el-date-picker type="date" v-model={form[fieldName]} value-format={valueFormat} placeholder={placeholder} disabled={disabled} style={{ ...style }} />
        </el-form-item>
      );
    },
    DATE_TIME(option) {
      const { form } = this;
      const { label, fieldName, valueFormat = 'yyyy-MM-dd HH:mm:ss', style = {}, placeholder, disabled } = option;
      return (
        <el-form-item key={fieldName} label={label} prop={fieldName}>
          <el-date-picker type="datetime" v-model={form[fieldName]} value-format={valueFormat} placeholder={placeholder} disabled={disabled} style={{ ...style }} />
        </el-form-item>
      );
    },
    RANGE_DATE(option) {
      const { form } = this;
      const { label, fieldName, valueFormat = 'yyyy-MM-dd HH:mm:ss', style = {}, placeholder, disabled } = option;
      return (
        <el-form-item key={fieldName} label={label} prop={fieldName}>
          <el-date-picker
            type="daterange"
            v-model={form[fieldName]}
            value-format={valueFormat}
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            unlink-panels={true}
            disabled={disabled}
            style={{ ...style }}
            pickerOptions={this.pickerOptions}
            onChange={val => {
              // 点击了清空按钮
              if (val === null) {
                form[fieldName] = [];
                this.excuteFormData(form);
              }
            }}
          />
        </el-form-item>
      );
    },
    CHECKBOX(option) {
      const { form } = this;
      const { label, fieldName, options = {}, style = {}, placeholder, disabled, change = () => {} } = option;
      const { trueValue = '1', falseValue = '0' } = options;
      return (
        <el-form-item key={fieldName} label={label} prop={fieldName}>
          <el-checkbox v-model={form[fieldName]} disabled={disabled} style={{ ...style }} trueLabel={trueValue} falseLabel={falseValue} onChange={change}></el-checkbox>
        </el-form-item>
      );
    },
    MULTIPLE_CHECKBOX(option) {
      const { form } = this;
      const { label, fieldName, itemList, style = {}, placeholder, disabled, change = () => {} } = option;
      return (
        <el-form-item key={fieldName} label={label} prop={fieldName}>
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
    TEXT_AREA(option) {
      const { form } = this;
      const { label, fieldName, style = {}, placeholder, disabled, rows = 2, maxlength = 100 } = option;
      return (
        <el-form-item key={fieldName} label={label} prop={fieldName}>
          <el-input type="textarea" v-model={form[fieldName]} placeholder={placeholder} disabled={disabled} style={{ ...style }} clearable rows={rows} maxlength={maxlength} showWordLimit />
        </el-form-item>
      );
    },
    createSelectHandle(option, multiple = false) {
      const { form } = this;
      const { label, fieldName, request = {}, style = {}, placeholder, disabled, change = () => {} } = option;
      const { fetchApi, params = {} } = request;
      let { itemList } = option;
      if (!itemList && fetchApi) {
        itemList = this[`${fieldName}Options`] || [];
        if (!_.isEqual(this[`${fieldName}PrevParams`], params)) {
          this[`${fieldName}PrevParams`] = params;
          this.querySelectOptions(request, fieldName);
        }
      }
      return (
        <el-form-item key={fieldName} label={label} prop={fieldName}>
          <el-select
            multiple={multiple}
            v-model={form[fieldName]}
            placeholder={placeholder}
            disabled={disabled}
            style={{ ...style }}
            clearable
            onChange={change}
            nativeOnKeydown={this.enterEventHandle}
          >
            {itemList.map(x => (
              <el-option key={x.value} label={x.text} value={x.value} />
            ))}
          </el-select>
        </el-form-item>
      );
    },
    // 获取下拉框数据
    async querySelectOptions({ fetchApi, params = {}, datakey = '', valueKey = 'value', textKey = 'text' }, fieldName) {
      if (process.env.MOCK_DATA === 'true') {
        const res = require('@/mock/sHelperData').default;
        this[`${fieldName}Options`] = res.data.map(x => ({ value: x[valueKey], text: x[textKey] }));
      } else {
        const res = await fetchApi(params);
        if (res.resultCode === 200) {
          const dataList = !datakey ? res.data : _.get(res.data, datakey, []);
          this[`${fieldName}Options`] = dataList.map(x => ({ value: x[valueKey], text: x[textKey] }));
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
    createSerachHelperList(list, valueKey) {
      return list.map(x => ({ value: x[valueKey] }));
    },
    createInputTreeValue(fieldName, itemList) {
      let { text = '' } = this.deepFind(itemList, this.form[fieldName]) || {};
      return text;
    },
    treeInputClearHandle(fieldName) {
      this.form[fieldName] = undefined;
      this.$nextTick(() => this.$refs[fieldName].clearValidate());
    },
    filterNodeHandle(value, data) {
      if (!value) return true;
      return data.text.indexOf(value) !== -1;
    },
    treeNodeClickHandle(fieldName, { value }) {
      this.form[fieldName] = value;
      this.popoverVisible = false;
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
      this.$refs.form.validate(valid => {
        if (valid) {
          this.excuteFormData(this.form);
          this.$emit('filterChange', this.form);
        } else {
          // 校验没通过，展开
          this.expand = true;
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.form.resetFields();
      this.excuteFormData(this.form);
      this.$emit('filterChange', this.form);
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
    min-height: 32px;
    margin-bottom: 12px;
    .el-form-item {
      margin-bottom: 0;
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
