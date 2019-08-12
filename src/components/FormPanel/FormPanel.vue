<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-05-06 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-05-07 11:00:00
 **/
import _ from 'lodash';

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
    return {
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
              let { initialValue, type, fieldName } = x;
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
        if (this.formType === 'show') {
          x.disabled = true;
        }
        if (type === 'RANGE_DATE' || type === 'MULTIPLE_SELECT' || type === 'MULTIPLE_CHECKBOX') {
          initialValue = initialValue || [];
        }
        if (type === 'INPUT' && x.numberFormat) {
          initialValue = this.formatNumber(initialValue);
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
      const { label, fieldName, style = {}, placeholder, unitRender, readonly, disabled, change = () => {}, focus = () => {} } = option;
      return (
        <el-form-item label={label} prop={fieldName}>
          <el-input
            v-model={form[fieldName]}
            placeholder={placeholder}
            readonly={readonly}
            disabled={disabled}
            style={{ ...style }}
            clearable
            onChange={change}
            onFocus={focus}
            nativeOnKeydown={this.enterEventHandle}
          >
            {unitRender && <template slot="append">{unitRender()}</template>}
          </el-input>
        </el-form-item>
      );
    },
    INPUT_NUMBER(option) {
      const { form } = this;
      const { label, fieldName, style = {}, placeholder, disabled, min = 0, max = 99999999, step = 1, precision, change = () => {}, focus = () => {} } = option;
      return (
        <el-form-item label={label} prop={fieldName}>
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
            onFocus={focus}
          ></el-input-number>
        </el-form-item>
      );
    },
    INPUT_TREE(option) {
      const { form } = this;
      const { label, fieldName, itemList, style = {}, placeholder, readonly, disabled, change = () => {} } = option;
      return (
        <el-form-item ref={fieldName} label={label} prop={fieldName}>
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
        <el-form-item label={label} prop={fieldName}>
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
      const { form } = this;
      const { label, fieldName, itemList, style = {}, placeholder, disabled, change = () => {} } = option;
      return (
        <el-form-item label={label} prop={fieldName}>
          <el-select v-model={form[fieldName]} placeholder={placeholder} disabled={disabled} style={{ ...style }} clearable onChange={change} nativeOnKeydown={this.enterEventHandle}>
            {/* <el-option key="-" label="全部" value="0" /> */}
            {itemList.map(x => (
              <el-option key={x.value} label={x.text} value={x.value} />
            ))}
          </el-select>
        </el-form-item>
      );
    },
    MULTIPLE_SELECT(option) {
      const { form } = this;
      const { label, fieldName, itemList, style = {}, placeholder, disabled, change = () => {} } = option;
      return (
        <el-form-item label={label} prop={fieldName}>
          <el-select multiple={true} v-model={form[fieldName]} placeholder={placeholder} disabled={disabled} style={{ ...style }} clearable onChange={change}>
            {itemList.map(x => (
              <el-option key={x.value} label={x.text} value={x.value} />
            ))}
          </el-select>
        </el-form-item>
      );
    },
    DATE(option) {
      const { form } = this;
      const { label, fieldName, valueFormat = 'yyyy-MM-dd HH:mm:ss', style = {}, placeholder, disabled } = option;
      return (
        <el-form-item label={label} prop={fieldName}>
          <el-date-picker type="date" v-model={form[fieldName]} value-format={valueFormat} placeholder={placeholder} disabled={disabled} style={{ ...style }} nativeOnKeydown={this.enterEventHandle} />
        </el-form-item>
      );
    },
    DATE_TIME(option) {
      const { form } = this;
      const { label, fieldName, valueFormat = 'yyyy-MM-dd HH:mm:ss', style = {}, placeholder, disabled } = option;
      return (
        <el-form-item label={label} prop={fieldName}>
          <el-date-picker
            type="datetime"
            v-model={form[fieldName]}
            value-format={valueFormat}
            placeholder={placeholder}
            disabled={disabled}
            style={{ ...style }}
            nativeOnKeydown={this.enterEventHandle}
          />
        </el-form-item>
      );
    },
    RANGE_DATE(option) {
      const { form } = this;
      const { label, fieldName, valueFormat = 'yyyy-MM-dd HH:mm:ss', style = {}, placeholder, disabled } = option;
      return (
        <el-form-item label={label} prop={fieldName}>
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
          />
        </el-form-item>
      );
    },
    CHECKBOX(option) {
      const { form } = this;
      const { label, fieldName, style = {}, placeholder, disabled, change = () => {} } = option;
      return (
        <el-form-item label={label} prop={fieldName}>
          <el-checkbox v-model={form[fieldName]} disabled={disabled} style={{ ...style }} true-label={'1'} false-label={'0'} onChange={change}></el-checkbox>
        </el-form-item>
      );
    },
    MULTIPLE_CHECKBOX(option) {
      const { form } = this;
      const { label, fieldName, itemList, style = {}, placeholder, disabled, change = () => {} } = option;
      return (
        <el-form-item label={label} prop={fieldName}>
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
        <el-form-item label={label} prop={fieldName}>
          <el-input type="textarea" v-model={form[fieldName]} placeholder={placeholder} disabled={disabled} style={{ ...style }} clearable rows={rows} maxlength={maxlength} showWordLimit />
        </el-form-item>
      );
    },
    // 获取搜索帮助数据
    async querySearchAsync(request, fieldName, queryString = '', cb) {
      const { fetchApi, params = {}, datakey = '', fieldKey } = request;
      if (process.env.MOCK_DATA === 'true') {
        const res = require('@/mock/sHelperData').default;
        setTimeout(() => {
          cb(this.createSerachHelperList(res.data, fieldKey));
        }, 500);
      } else {
        const res = await fetchApi({ ...{ [fieldName]: queryString }, ...params });
        if (res.resultCode === 200) {
          const dataList = !datakey ? res.data : _.get(res.data, datakey, []);
          cb(this.createSerachHelperList(dataList, fieldKey));
        }
      }
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
    createSerachHelperList(list, fieldKey) {
      return list.map(x => ({ value: x[fieldKey] }));
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
    submitForm(ev) {
      ev && ev.preventDefault();
      this.$refs.form.validate(valid => {
        if (valid) {
          const { form } = this;
          for (let attr in form) {
            if (attr.includes('|') && Array.isArray(form[attr])) {
              let [startTime, endTime] = attr.split('|');
              form[startTime] = form[attr][0];
              form[endTime] = form[attr][1];
            }
          }
          return this.$emit('formChange', form);
        }
        return false;
      });
    },
    resetForm() {
      this.$refs.form.resetFields();
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
    createFormLayout() {
      const colSpan = 24 / this.cols;
      const formItems = this.createFormItem().filter(item => item !== null);
      const allColSpan = ['TEXT_AREA', 'MULTIPLE_CHECKBOX'];
      const colFormItems = formItems.map((Node, i) => {
        return (
          <el-col key={i} span={allColSpan.includes(Node.type) ? 24 : colSpan}>
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
    margin-bottom: 16px;
    .el-form-item {
      margin-bottom: 0;
      .el-form-item__content {
        line-height: 30px;
      }
    }
  }
  .el-form-item__label {
    font-size: @textSizeSecondary;
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
  .el-input-number {
    width: 100%;
    .el-input__inner {
      text-align: left !important;
    }
    .el-input-number__increase:hover ~ .el-input .el-input__inner:not(.is-disabled),
    .el-input-number__decrease:hover ~ .el-input .el-input__inner:not(.is-disabled) {
      border-color: #d9d9d9;
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
</style>
