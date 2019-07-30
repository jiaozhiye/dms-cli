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
    return {
      form: this.createFormData(this.list),
      rules: this.createFormRule(this.list)
    };
  },
  watch: {
    list(val) {
      val.forEach(x => {
        if (x.initialValue !== this.form[x.fieldName]) {
          this.form[x.fieldName] = x.initialValue;
          // 对组件外 js 动态赋值的表单元素进行校验
          this.$refs.form.validateField(x.fieldName);
        }
      });
    },
    form: {
      handler(val) {
        this.list.forEach(x => (x.initialValue = val[x.fieldName]));
      },
      deep: true
    }
  },
  methods: {
    createFormData(list) {
      const target = {};
      list.forEach(x => {
        if (this.formType === 'show') {
          x.disabled = true;
        }
        if (x.type === 'RANGE_DATE' || x.type === 'MULTIPLE_SELECT') {
          x.initialValue = [];
        }
        // 初始值
        target[x.fieldName] = x.initialValue;
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
      const { label, fieldName, style = {}, placeholder, unit, readonly, disabled, focus = () => {} } = option;
      return (
        <el-form-item label={label} prop={fieldName}>
          <el-input v-model={form[fieldName]} placeholder={placeholder} readonly={readonly} disabled={disabled} style={{ ...style }} clearable onFocus={focus} nativeOnKeydown={this.enterEventHandle}>
            {unit && <template slot="append">{unit}</template>}
          </el-input>
        </el-form-item>
      );
    },
    INPUT_NUMBER(option) {
      const { form } = this;
      const { label, fieldName, style = {}, placeholder, disabled, min = 0, max = 9999, step = 1, precision } = option;
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
            precision={precision}
          ></el-input-number>
        </el-form-item>
      );
    },
    SEARCH_HELPER(option) {
      const { form } = this;
      const { label, fieldName, request = {}, style = {}, placeholder, disabled } = option;
      return (
        <el-form-item label={label} prop={fieldName}>
          <el-autocomplete
            v-model={form[fieldName]}
            placeholder={placeholder}
            disabled={disabled}
            style={{ ...style }}
            clearable
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
            <el-option key="-" label="全部" value="0" />
            {itemList.map(x => (
              <el-option key={x.value} label={x.text} value={x.value} />
            ))}
          </el-select>
        </el-form-item>
      );
    },
    MULTIPLE_SELECT(option) {
      const { form } = this;
      const { label, fieldName, itemList, style = {}, placeholder, disabled } = option;
      return (
        <el-form-item label={label} prop={fieldName}>
          <el-select multiple={true} v-model={form[fieldName]} placeholder={placeholder} disabled={disabled} style={{ ...style }} clearable>
            {itemList.map(x => (
              <el-option key={x.value} label={x.text} value={x.value} />
            ))}
          </el-select>
        </el-form-item>
      );
    },
    DATE(option) {
      const { form } = this;
      const { label, fieldName, style = {}, placeholder, disabled } = option;
      return (
        <el-form-item label={label} prop={fieldName}>
          <el-date-picker
            type="date"
            v-model={form[fieldName]}
            value-format="yyyy-MM-dd HH:mm:ss"
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
      const { label, fieldName, style = {}, placeholder, disabled } = option;
      return (
        <el-form-item label={label} prop={fieldName}>
          <el-date-picker
            type="daterange"
            v-model={form[fieldName]}
            value-format="yyyy-MM-dd HH:mm:ss"
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
    createSerachHelperList(list, fieldKey) {
      return list.map(x => ({ value: x[fieldKey] }));
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
          return this.$emit('formChange', this.form);
        }
        return false;
      });
    },
    resetForm() {
      this.$refs.form.resetFields();
    },
    createFormLayout() {
      const colSpan = 24 / this.cols;
      const formItems = this.createFormItem().filter(item => item !== null);
      const colFormItems = formItems.map((Node, i) => {
        return (
          <el-col key={i} span={Node.type !== 'TEXT_AREA' ? colSpan : 2 * colSpan}>
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
