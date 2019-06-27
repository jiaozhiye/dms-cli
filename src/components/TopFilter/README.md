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
- cols{Number|每行显示多小列，默认是 3}
- filterChange{Function|点击搜索按钮触发的事件，参数是搜索条件对象}
- onCollapse{Function|展开-收起时的回调函数，状态变化时处罚，参数是当前状态}

`list 字段配置项`

- type{String|类型，支持 INPUT/SELECT/DATE/RANGE_DATE/MULTIPLE_SELECT/SEARCH_HELPER}
- label{String|标题，最好不超过 6 个字}
- fieldName{String|字段名称 key}
- placeholder{String|提示文字}
- initialValue{String/Array|默认值}
- style{Object|表单元素的 style}
- itemList{Array|下拉框(SELECT/MULTIPLE_SELECT)的数据，[{text: '', value: ''}]}
- rules{Array|表单验证规则，用法请参考 Element-Ui}

`SEARCH_HELPER 配置项`

- request: {
  - &emsp;fetchApi: {Function|搜索帮助的接口函数}
  - &emsp;params: {Object|接口的默认参数}
  - &emsp;datakey: {String|服务端响应数据的数组列表的 key，支持路径操作('step1.step2.items')，不指定表示 res.data 就是数组数据}
  - &emsp;fieldKey: {String|数据的字段名}
- }

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