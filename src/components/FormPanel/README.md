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
- scrollContainer{HTMLNode|具有滚动条的容器，需要具有定位属性，用于表单校验信息的锚点定位}
- isSubmitBtn{Boolean|是否显示保存/重置按钮，默认是 true}
- formChange{Function|点击保存按钮触发的事件，参数是表单数据对象}

`list 字段配置项`

- type{String|类型，支持 INPUT/INPUT_NUMBER/RANGE_INPUT/RANGE_INPUT_NUMBER/INPUT_TREE/SELECT/MULTIPLE_SELECT/CHECKBOX/MULTIPLE_CHECKBOX/DATE/RANGE_DATE/SEARCH_HELPER/SEARCH_HELPER_WEB/TEXT_AREA/UPLOAD_IMG/UPLOAD_FILE/RADIO/TIME/RANGE_TIME/TIME_SELECT/RANGE_TIME_SELECT/INPUT_CASCADER/TINYMCE/BREAK_SPACE(分隔符)}
- label{String|标题，最好不超过 6 个字}
- labelWidth{String|表单域标签的的宽度，字符串类型，需要加单位(px)}
- fieldName{String|字段名称 key}
- selfCols{Number|表单元素自身占据的列数}
- offsetLeftCols{Number|表单元素左侧的间隔列数}
- offsetRightCols{Number|表单元素右侧的间隔列数}
- placeholder{String|提示文字}
- initialValue{String/Array|默认值}
- style{Object|表单元素的 style}
- hidden{Boolean|是否隐藏该表单项}
- filterable{Boolean|是否开启下拉框的拼音头快速检索功能，默认 false}
- unitRender{Function|输入框的后置单位的渲染方法, 返回值是 JSX 节点，只对 INPUT 有效}
- readonly{Boolean|是否只读}
- disabled{Boolean|禁用}
- limit{Number|最多可以选择的项目数，只对 MULTIPLE_SELECT/MULTIPLE_CHECKBOX 有效}
- clearable{Boolean|是否启用右侧清除按钮，只对 SELECT/MULTIPLE_SELECT 有效，默认开启}
- noResetable{Boolean|表单项的值不会被重置，默认(false) -> 会被重置，true -> 不会被重置}
- precision{Number|数值精度，之针对 INPUT_NUMBER 有效}
- numberFormat{Boolean|指定金融类数值格式，100,000,000, 只对 INPUT 有效}
- onFocus{Function|输入框获得焦点的事件}
- onEnter{Function|输入框回车的事件}
- rows{Number|输入框行数，默认是 2，只对 TEXT_AREA 有效}
- dateType{String|日期控件的类型，只对 DATE 和 RANGE_DATE 生效，可选值为 date/datetime/exactdate/month/daterange/datetimerange/exactdaterange/monthrange}
- minDateTime{String|最小日期，小于该时间的日期段将被禁用}
- maxDateTime{String|最大日期，大于该时间的日期段将被禁用}
- options{Object|有些表单控件所需要的配置}
- change{Function|checkbox 或 select 值变化的回调}
- onInput{Function|INPUT 类型的对应的 input 事件}
- itemList{Array|下拉框(SELECT/MULTIPLE_SELECT)的数据，[{text: '', value: ''}]}
- min{Number|最小值，只针对 INPUT_NUMBER|RANGE_INPUT_NUMBER 生效}
- max{Number|最大值，只针对 INPUT_NUMBER|RANGE_INPUT_NUMBER 生效}
- step{Number|步长，只针对 INPUT_NUMBER|RANGE_INPUT_NUMBER 生效}
- minlength{Number|原生属性，最小输入长度，只针对 INPUT 生效}
- maxlength{Number|原生属性，最大输入长度，只针对 INPUT|TEXT_AREA 生效}
- pattern{RegExp|表单控件格式校验/^[0-9a-zA-Z ]{0,11}\$/，只针对 INPUT 生效}
- secretType{String|字段值的保密类型，可选参数 name/phone/IDnumber，只针对 INPUT 生效，并切在只读或禁用的状态下}
- rules{Array|表单验证规则，用法请参考 Element-Ui，支持自定义表单校验}
- render{Function|表单元素的渲染函数，返回值是 JSX 类型节点}

`list -> options 配置项`

- options: {
  - &emsp;trueValue: {String/Number|CHECKBOX 选中后的值，默认是 '1'}
  - &emsp;falseValue: {String/Number|CHECKBOX 取消选中后的值，默认是 '0'}
  - &emsp;startTime: {String|TIME_SELECT 开始时间}
  - &emsp;endTime: {String|TIME_SELECT 结束时间}
  - &emsp;stepTime: {String|TIME_SELECT 时间步长}
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

`UPLOAD_IMG 配置项`

- upload: {
  - &emsp;actionUrl: {String|必选参数，上传的地址}
  - &emsp;fixedSize: {Array|裁剪框的宽高比，[w, h]}
  - &emsp;isCalcHeight: {Boolean|是否根据裁剪图片宽高比自动计算上传组件容器高度，默认值 false}
  - &emsp;limit: {Number|支持上传图片的数量，默认是 1}
  - &emsp;params: {Object|上传图片请求的额外参数}
  - &emsp;titles: {Array|图片对应的标题，元素的个数与 limit 一致}
  - &emsp;tipText: {String|上传图片格式的提示文字}
- }

`UPLOAD_FILE 配置项`

- upload: {
  - &emsp;actionUrl: {String|必选参数，上传的地址}
  - &emsp;fileSize: {Number|上传文件大小的限制，默认是 5M}
  - &emsp;limit: {Number|支持上传文件的数量，默认是 1}
  - &emsp;params: {Object|上传文件请求的额外参数}
  - &emsp;fileTypes: {Array|允许上传文件的格式数组 ['jpg', 'jpeg', 'png', 'pdf']}
- }
- 注意：关于附件上传前后端数据交互的格式为 {name: 'xxx', url: 'xxx'}，因此服务端返回的数据格式要满足 name, url 两个字段的格式，name 用于回显文件名

`组件暴露的方法`

- SUBMIT_FORM{Function|获取所有表单控件数据的集合，返回值为表单数据}
- RESET_FORM{Function|重置表单控件}
- GET_FORM_DATA{Function|异步函数，获取表单数据，返回值为数组 [err, formData]}

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
    validateFn(rule, value, callback) {
      if (value.length < rule.limit) {
        return callback(new Error(rule.message));
      }
      callback();
    },
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
        },
        {
          type: 'UPLOAD_IMG',
          label: '上传身份证',
          fieldName: 'wayPicture',
          placeholder: '上传身份证...',
          rules: [
            { required: true, message: '请上传身份证', trigger: 'change' },
            { limit: 2, validator: this.validateFn, message: '请上传两张图片', trigger: 'change' }
          ],
          upload: {
            actionUrl: '/api/file/oss/upload',
            fixedSize: [5, 3],
            limit: 2,
            isCalcHeight: true
          }
        },
        {
          type: 'UPLOAD_FILE',
          label: '上传文件',
          fieldName: 'wayFiles',
          placeholder: '上传文件...',
          rules: [{ required: true, message: '请上传文件', trigger: 'change' }],
          initialValue: [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }],
          upload: {
            actionUrl: '/api/file/oss/upload',
            limit: 2,
            fileTypes: ['jpg', 'png']
          }
        }
      ];
    },
    changeHandle(val){
      console.log('表单面板的数据：', val);
    }
  }
};
```
