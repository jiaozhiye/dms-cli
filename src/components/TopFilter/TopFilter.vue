<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-05-06 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-05-07 11:00:00
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
    }
  },
  data() {
    return {
      expand: false, // 展开收起状态
      form: this.createFormData(this.list),
      rules: this.createFormRule(this.list)
    };
  },
  watch: {
    list(val) {
      val.forEach(x => {
        if (x.initialValue !== this.form[x.fieldName]) {
          this.form[x.fieldName] = x.initialValue;
          // 对组件外js动态赋值的表单元素进行校验
          this.$refs.form.validateField(x.fieldName);
        }
      });
    },
    form: {
      handler(val) {
        this.list.forEach(x => (x.initialValue = val[x.fieldName]));
      },
      deep: true
    },
    expand(val) {
      this.$emit('onCollapse', val);
    }
  },
  methods: {
    createFormData(list) {
      const target = {};
      list.forEach(x => {
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
      const { label, fieldName, style = {}, placeholder } = option;
      return (
        <el-form-item label={label} prop={fieldName}>
          <el-input v-model={form[fieldName]} placeholder={placeholder} style={{ ...style }} clearable />
        </el-form-item>
      );
    },
    SEARCH_HELPER(option) {
      const { form } = this;
      const { label, fieldName, request = {}, style = {}, placeholder } = option;
      return (
        <el-form-item label={label} prop={fieldName}>
          <el-autocomplete
            v-model={form[fieldName]}
            placeholder={placeholder}
            style={{ ...style }}
            clearable
            fetchSuggestions={(queryString, cb) => this.querySearchAsync(request, fieldName, queryString, cb)}
          />
        </el-form-item>
      );
    },
    SELECT(option) {
      const { form } = this;
      const { label, fieldName, itemList, style = {}, placeholder } = option;
      return (
        <el-form-item label={label} prop={fieldName}>
          <el-select v-model={form[fieldName]} placeholder={placeholder} style={{ ...style }} clearable>
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
      const { label, fieldName, itemList, style = {}, placeholder } = option;
      return (
        <el-form-item label={label} prop={fieldName}>
          <el-select multiple={true} v-model={form[fieldName]} placeholder={placeholder} style={{ ...style }} clearable>
            {itemList.map(x => (
              <el-option key={x.value} label={x.text} value={x.value} />
            ))}
          </el-select>
        </el-form-item>
      );
    },
    DATE(option) {
      const { form } = this;
      const { label, fieldName, style = {}, placeholder } = option;
      return (
        <el-form-item label={label} prop={fieldName}>
          <el-date-picker type="date" v-model={form[fieldName]} value-format="yyyy-MM-dd HH:mm:ss" placeholder={placeholder} style={{ ...style }} />
        </el-form-item>
      );
    },
    RANGE_DATE(option) {
      const { form } = this;
      const { label, fieldName, style = {}, placeholder } = option;
      return (
        <el-form-item label={label} prop={fieldName}>
          <el-date-picker
            type="daterange"
            v-model={form[fieldName]}
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style={{ ...style }}
          />
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
        return !this[item.type] ? null : this[item.type](item);
      });
    },
    submitForm(e) {
      e.preventDefault();
      this.$refs.form.validate(valid => {
        if (valid) {
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
    },
    toggleHandler() {
      this.expand = !this.expand;
    },
    createFormLayout() {
      const colSpan = 24 / this.cols;
      const buttonNode = (
        <el-col key="-" span={colSpan}>
          <el-button size="small" type="primary" style={{ marginLeft: '10px' }} onClick={this.submitForm}>
            搜索
          </el-button>
          <el-button size="small" onClick={this.resetForm}>
            重置
          </el-button>
          <el-button size="small" type="text" onClick={this.toggleHandler}>
            {this.expand ? '收起' : '展开'} <i class={this.expand ? 'el-icon-arrow-up' : 'el-icon-arrow-down'} />
          </el-button>
        </el-col>
      );
      const formItems = this.createFormItem().filter(item => item !== null);
      const count = this.expand ? formItems.length : this.cols - 1;
      const colFormItems = formItems.map((Node, i) => (
        <el-col key={i} span={colSpan} style={{ display: i < count ? 'block' : 'none' }}>
          {Node}
        </el-col>
      ));
      return [...colFormItems, buttonNode];
    }
  },
  render() {
    const { form, rules } = this;
    return (
      <div class="top-filter">
        <el-form ref="form" size="small" model={form} rules={rules} label-width="80px">
          <el-row gutter={10}>{this.createFormLayout()}</el-row>
        </el-form>
      </div>
    );
  }
};
</script>

<style lang="less">
.top-filter {
  margin-bottom: 10px;
  .el-col {
    height: 32px;
    margin: 10px 0;
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
