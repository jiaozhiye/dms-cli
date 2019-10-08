<h1 align="center">
  A Vue TopFilter Component by jzy
</h1>

#### TopFilter 组件调用

`组件的引用`

```bash
# main.js
import TopFilter from '@/components/TopFilter';
Vue.use(TopFilter);
```

`组件参数API`

- list{Array|头部筛选条件数组，支持动态赋值(数据数组必须是新的引用)}
- cols{Number|每行显示多小列，默认是 3，注意：只能是被 24 整除的值}
- labelWidth{Number|label 标签的宽度，默认是 80}
- filterChange{Function|点击搜索按钮触发的事件，参数是搜索条件对象}
- collapse{Boolean|是否显示展开/收起按钮，默认是 true}
- isSubmitBtn{Boolean|是否显示搜索/重置按钮，默认是 true}
- onCollapse{Function|展开-收起时的回调函数，状态变化时处罚，参数是当前状态}

`list 字段配置项`

- type{String|类型，支持 INPUT/INPUT_NUMBER/INPUT_TREE/SELECT/MULTIPLE_SELECT/CHECKBOX/MULTIPLE_CHECKBOX/DATE/DATE_TIME/RANGE_DATE/SEARCH_HELPER/SEARCH_HELPER_WEB/TEXT_AREA/INPUT_CASCADER}
- label{String|标题，最好不超过 6 个字}
- labelWidth{String|表单域标签的的宽度，字符串类型，需要加单位(px)}
- fieldName{String|字段名称 key}
- placeholder{String|提示文字}
- initialValue{String/Array|默认值}
- style{Object|表单元素的 style}
- hidden{Boolean|是否隐藏该表单项}
- filterable{Boolean|是否开启下拉框的拼音头快速检索功能，默认 false}
- unitRender{Function|输入框的后置单位的渲染方法, 返回值是 JSX 节点，只对 INPUT 有效}
- readonly{Boolean|是否只读}
- disabled{Boolean|禁用}
- onFocus{Function|输入框获得焦点的事件}
- rows{Number|输入框行数，默认是 2，只对 TEXT_AREA 有效}
- maxlength{Number|最大输入长度，默认是 100，只对 TEXT_AREA 有效}
- valueFormat{String|指定日期组件值的格式，参考 Element UI}
- options{Object|有些表单控件所需要的配置}
- change{Function|checkbox 或 select 值变化的回调}
- itemList{Array|下拉框(SELECT/MULTIPLE_SELECT)的数据，[{text: '', value: ''}]}
- rules{Array|表单验证规则，用法请参考 Element-Ui，支持自定义表单校验}
- render{Function|表单元素的渲染函数，返回值是 JSX 类型节点}

`list -> options 配置项`

- options: {
  - &emsp;trueValue: {String/Number|CHECKBOX 选中后的值，默认是 '1'}
  - &emsp;falseValue: {String/Number|CHECKBOX 取消选中后的值，默认是 '0'}
  - &emsp;titles: {Array|级联选择器的标题，数组元素为字符串类型}
- }

`list -> labelOptions 配置项`

- labelOptions: {
  - &emsp;fieldName: {String|字段名称 key}
  - &emsp;initialValue: initialValue{String/Array|默认值}
  - &emsp;itemList: {Array|下拉框(SELECT)的数据，[{text: '', value: ''}]}
  - &emsp;style: {Object|表单元素的 style}
  - &emsp;disabled: {Boolean|禁用}
  - &emsp;change: {Function|checkbox 或 select 值变化的回调}
- }

`list -> descOptions 配置项`

- descOptions: {
  - &emsp;isTooltip: {Boolean|是否以 Tooltip 形式显示描述信息}
  - &emsp;style: {Object|描述信息容器的 style}
  - &emsp;content: {String|描述信息内容}
- }
- 注意：描述信息会占据原有表单元素的部分空间，因此需要通过 list 配置项中的 style 来控制表单元素的宽度

`SEARCH_HELPER|SELECT|MULTIPLE_SELECT 配置项`

- request: {
  - &emsp;fetchApi: {Function|搜索帮助的接口函数}
  - &emsp;params: {Object|接口的默认参数}
  - &emsp;datakey: {String|服务端响应数据的数组列表的 key，支持路径操作('step1.step2.items')，不指定表示 res.data 就是数组数据}
  - &emsp;valueKey: {String|数据值的字段名}
  - &emsp;textKey: {String|数据文本的字段名}
- }

`组件暴露的方法`

- SUBMIT_FORM{Function|获取所有表单控件数据的集合，返回值为表单数据}
- RESET_FORM{Function|重置表单控件}
- GET_FORM_DATA{Function|异步函数，获取表单数据，返回值为数组 [err, formData]}

`示例代码`

```bash
# template
<template>
  <TopFilter :list="topFilterList" :cols="3" @filterChange="changeHandle"></TopFilter>
</template>

# js
export default {
  data() {
    return {
      topFilterList: this.createTopFilters()
    };
  },
  methods: {
    createTopFilters() {
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
      console.log('搜索的参数：', val)
    }
  }
};
```
