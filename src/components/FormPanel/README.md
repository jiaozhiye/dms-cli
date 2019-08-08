<h1 align="center">
  A Vue FormPanel Component by jzy
</h1>

#### FormPanel 组件调用

`组件的引用`

```bash
# main.js
import FormPanel from '@/components/FormPanel';
Vue.use(FormPanel);
```

`组件参数API`

- list{Array|表单面板组件数据数组，支持动态赋值(数据数组必须是新的引用)}
- formType{String|表单面板的类型 add/edit/show，默认值 add}
- cols{Number|每行显示多小列，默认是 3，注意：只能是被 24 整除的值}
- labelWidth{Number|label 标签的宽度，默认是 80}
- formChange{Function|点击保存按钮触发的事件，参数是表单数据对象}
- isSubmitBtn{Boolean|是否显示保存/重置按钮，默认是 true}

`list 字段配置项`

- type{String|类型，支持 INPUT/SELECT/DATE/RANGE_DATE/MULTIPLE_SELECT/SEARCH_HELPER/INPUT_NUMBER/TEXT_AREA/INPUT_TREE}
- label{String|标题，最好不超过 6 个字}
- fieldName{String|字段名称 key}
- placeholder{String|提示文字}
- initialValue{String/Array|默认值}
- style{Object|表单元素的 style}
- unit{String|输入框的后置单位, 只对 INPUT 有效}
- readonly{Boolean|是否只读}
- disabled{Boolean|禁用}
- numberFormat{Boolean|指定金融类数值格式，100,000,000, 只对 INPUT 有效}
- focus{Function|输入框获得焦点的回调}
- rows{Number|输入框行数，默认是 2，只对 TEXT_AREA 有效}
- maxlength{Number|最大输入长度，默认是 100，只对 TEXT_AREA 有效}
- valueFormat{String|指定日期组件值的格式，参考 Element UI}
- change{Function|checkbox 或 select 值变化的回调}
- itemList{Array|下拉框(SELECT/MULTIPLE_SELECT)的数据，[{text: '', value: ''}]}
- rules{Array|表单验证规则，用法请参考 Element-Ui，支持自定义表单校验}

`SEARCH_HELPER 配置项`

- request: {
  - &emsp;fetchApi: {Function|搜索帮助的接口函数}
  - &emsp;params: {Object|接口的默认参数}
  - &emsp;datakey: {String|服务端响应数据的数组列表的 key，支持路径操作('step1.step2.items')，不指定表示 res.data 就是数组数据}
  - &emsp;fieldKey: {String|数据的字段名}
- }

`组件暴露的方法`

- SUBMIT_FORM{Function|获取所有表单控件数据的集合}
- RESET_FORM{Function|重置表单控件}

`示例代码`

```bash
# template
<template>
  <FormPanel :list="formList" formType="add" @formChange="changeHandle" />
</template>

# js
export default {
  data() {
    return {
      formList: this.createFormList()
    };
  },
  methods: {
    createFormList() {
      return [
        {
          type: 'INPUT',
          label: '搜索',
          fieldName: 'title',
          placeholder: '请输入标题名称...',
          initialValue: '',
          style: { width: '200px' },
          rules: [{ required: true, message: '请输入标题名称', trigger: 'blur' }, { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }]
        },
        {
          type: 'SELECT',
          label: '所属分类',
          fieldName: 'cid',
          placeholder: '所属分类',
          itemList: [{ text: '热点', value: '1' }, { text: '资讯', value: '2' }],
          rules: [{ required: true, message: '请选择所属分类', trigger: 'change' }]
        }
      ];
    },
    changeHandle(val){
      console.log('表单面板的数据：', val)
    }
  }
};
```
