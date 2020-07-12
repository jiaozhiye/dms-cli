## API

### FormPanel

| 参数            | 说明                                            | 类型                | 默认值  |
| --------------- | ----------------------------------------------- | ------------------- | ------- |
| list            | 表单组件数据数组，[配置项](#formItem)，必要参数 | array               | -       |
| initialValue    | 表单组件的初始值，只在组件首次加载时生效        | obkect              | -       |
| formType        | 表单的类型                                      | default \| onlyShow | default |
| cols            | 每行显示的列数(被 24 整除)，不设置默认为自适应  | number              | -       |
| labelWidth      | label 标签的宽度，单位 px                       | number              | 80      |
| scrollContainer | 具有滚动条的容器，用于表单校验信息的锚点定位    | HTMLNode            | -       |
| isSubmitBtn     | 是否显示保存、重置按钮                          | boolean             | false   |

### 事件

| 事件名称     | 说明                     | 回调参数                     |
| ------------ | ------------------------ | ---------------------------- |
| change       | 表单提交，触发的事件     | Function(formValue:object)   |
| valuesChange | 字段值更新时，触发的事件 | Function(changeValue:object) |

### 方法

| 方法名称         | 说明                         | 参数                       | 返回值                                        |
| ---------------- | ---------------------------- | -------------------------- | --------------------------------------------- |
| SUBMIT_FORM      | 执行表单提交                 | -                          | 通过校验，返回表单对象；未通过校验，返回 null |
| RESET_FORM       | 重置表单控件                 | -                          | -                                             |
| SET_FIELDS_VALUE | 设置表单字段的值             | Function(values:object)    | -                                             |
| SET_FORM_VALUES  | 可以设置除了表单字段的额外值 | Function(values:object)    | -                                             |
| GET_FORM_DATA    | 获取表单数据，异步方法       | -                          | 返回错误前置的数组 [error, formValue]         |
| GET_FIELD_VALUE  | 获取表单项的值               | Function(fieldName:string) | 返回表单字段值                                |

### formType

| 表单类型           | 说明                 |
| ------------------ | -------------------- |
| INPUT              | 文本输入框           |
| INPUT_NUMBER       | 数字输入框           |
| RANGE_INPUT        | 区间类型的文本输入框 |
| RANGE_INPUT_NUMBER | 区间类型的数字输入框 |
| INPUT_TREE         | 树结构输入框         |
| INPUT_CASCADER     | 下拉框的级联选择     |
| SELECT             | 单选下拉框           |
| MULTIPLE_SELECT    | 多选下拉框           |
| CHECKBOX           | 复选框               |
| MULTIPLE_CHECKBOX  | 复选框组             |
| RADIO              | 单选按钮             |
| DATE               | 日期类型             |
| RANGE_DATE         | 日期区间类型         |
| SEARCH_HELPER      | 搜索帮助             |
| SEARCH_HELPER_WEB  | 搜索帮助             |
| TEXT_AREA          | 文本域               |
| UPLOAD_IMG         | 图片上传             |
| UPLOAD_FILE        | 附件上传             |
| TIME               | 时间类型             |
| RANGE_TIME         | 时间区间类型         |
| TIME_SELECT        | 可选择时间类型       |
| RANGE_TIME_SELECT  | 可选择时间区间类型   |
| TINYMCE            | 富文本编辑器         |
| BREAK_SPACE        | 表单分隔符           |

### formItem

| 参数            | 说明                                                          | 类型                | 默认值   |
| --------------- | ------------------------------------------------------------- | ------------------- | -------- |
| type            | 表单类型                                                      | [配置项](#formType) | string   | - |
| label           | 标题名称                                                      | string              | -        |
| labelWidth      | label 标签的的宽度，需要加单位 px                             | string              | 80       |
| fieldName       | 表单项字段 key                                                | string              | -        |
| style           | 表单元素的 css 样式                                           | object              | -        |
| rules           | 表单校验规则，用法请参考 Element-Ui                           | array               | -        |
| placeholder     | 表单元素的提示文字                                            | string              | -        |
| readonly        | 是否只读                                                      | boolean             | false    |
| disabled        | 是否禁用                                                      | boolean             | false    |
| hidden          | 是否隐藏表单项                                                | boolean             | false    |
| id              | 给分隔符加 id 属性，用于锚点定位，只对 BREAK_SPACE 生效       | string              | -        |
| clearable       | 是否开启擦除按钮                                              | boolean             | true     |
| noResetable     | 设置表单项是否会被重置                                        | boolean             | false    |
| selfCols        | 表单元素自身占据的列数                                        | number              | 1        |
| offsetLeftCols  | 表单元素左侧的间隔列数                                        | number              | 1        |
| offsetRightCols | 表单元素右侧的间隔列数                                        | number              | 1        |
| options         | 表单元素的外配置，[配置项](#options)                          | object              | -        |
| request         | 表单项的 ajax 请求配置，[配置项](#request)                    | object              | -        |
| upload          | 表单附件上传的配置，[配置项](#upload)                         | object              | -        |
| labelOptions    | label 标签的自定义渲染，[配置项](#labelOption)                | object              | -        |
| descOptions     | 描述信息的自定义渲染，[配置项](#descOption)                   | object              | -        |
| searchHelper    | 搜索帮助配置，参考 SearchHelper 组件，[配置项](#searchHelper) | object              | -        |
| render          | 表单元素的渲染方法                                            | func                | JSX Node |
| onChange        | 表单元素值变化的回调                                          | func                | -        |

### options

| 参数          | 说明                                                             | 类型                                 | 默认值   |
| ------------- | ---------------------------------------------------------------- | ------------------------------------ | -------- |
| itemList      | 下拉框的列表数据，[配置项](#item) - SELECT/MULTIPLE_CHECKBOX     | array                                | -        |
| filterable    | 是否开启下拉框的拼音头快速检索功能 - SELECT/MULTIPLE_CHECKBOX    | bool                                 | false    |
| limit         | 最多可以选择的项目数 - MULTIPLE_SELECT/MULTIPLE_CHECKBOX         | number                               | -        |
| rows          | 文本域的行数 - TEXT_AREA                                         | number                               | -        |
| minlength     | 原生属性，最小输入长度 - INPUT                                   | number                               | 0        |
| maxlength     | 原生属性，最大输入长度 - INPUT/TEXT_AREA                         | number                               | 200      |
| showLimit     | 是否显示输入字数统计，配合 maxlength 组合使用 - INPUT            | boolean                              | false    |
| pattern       | 表单元素值得正则格式校验                                         | regExp                               | -        |
| password      | 是否显示切换密码图标                                             | boolean                              | false    |
| secretType    | 字段值的保密类型，并切在只读或禁用的状态下有效 - INPUT           | finance \| name \| phone \| IDnumber | -        |
| min           | 最小值 - INPUT_NUMBER/RANGE_INPUT_NUMBER                         | number                               | 0        |
| max           | 最大值 - INPUT_NUMBER/RANGE_INPUT_NUMBER                         | number                               |          |
| step          | 数值变化的步长 - INPUT_NUMBER/RANGE_INPUT_NUMBER                 | number                               | 1        |
| precision     | 数值精度 - INPUT_NUMBER/RANGE_INPUT_NUMBER                       | number                               | -        |
| disabled      | 是否禁用列表项 - SELECT/MULTIPLE_SELECT/MULTIPLE_CHECKBOX/RADIO/ | boolean                              | false    |
| noInput       | 不允许手动输入，支持清除操作 - INPUT                             | boolean                              | false    |
| trueValue     | 选中的值 - CHECKBOX                                              | number \| string                     | 1        |
| falseValue    | 非中的值 - CHECKBOX                                              | number \| string                     | 0        |
| dateType      | 日期控件的类型，[配置项](#dateType) - DATE/RANGE_DATE            | string                               | -        |
| minDateTime   | 最小日期，小于该时间的日期段将被禁用                             | string                               | -        |
| maxDateTime   | 最大日期，大于该时间的日期段将被禁用                             | string                               | -        |
| defaultTime   | 默认的时间，格式 HH:mm:ss                                        | string                               | -        |
| startTime     | 开始时间 - TIME_SELECT                                           | string                               | 00:00    |
| endTime       | 结束时间 - TIME_SELECT                                           | string                               | 23:45    |
| stepTime      | 时间变化的步长 - TIME_SELECT                                     | string                               | 00:15    |
| titles        | 级联选择器的标题，数组元素为字符串类型 - INPUT_CASCADER          | array                                | -        |
| mustCheckLast | 级联选择器只能选择最后一级 - INPUT_CASCADER                      | bool                                 | false    |
| onInput       | 输入框 input 事件的回调 - INPUT                                  | func                                 | -        |
| onEnter       | 输入框回车事件的回调 - INPUT                                     | func                                 | -        |
| onFocus       | 输入框获得焦点事件的回调 - INPUT                                 | func                                 | -        |
| onBlur        | 输入框失去焦点事件的回调 - INPUT                                 | func                                 | -        |
| unitRender    | 输入框后置内容的渲染方法 - INPUT                                 | func                                 | JSX Node |

### dateType

| 参数           | 说明                                           | 类型   | 默认值 |
| -------------- | ---------------------------------------------- | ------ | ------ |
| date           | 日期类型，值得格式 yyyy-MM-dd HH:mm:ss         | tring  | -      |
| datetime       | 日期时间类型，值得格式 yyyy-MM-dd HH:mm:ss     | tring  | -      |
| exactdate      | 严格日期类型，值得格式 yyyy-MM-dd              | string | -      |
| daterange      | 日期区间类型，值得格式 yyyy-MM-dd HH:mm:ss     | string | -      |
| datetimerange  | 日期时间区间类型，值得格式 yyyy-MM-dd HH:mm:ss | string | -      |
| exactdaterange | 严格日期时间区间类型，值得格式 yyyy-MM-dd      | string | -      |
| month          | 月份类型，值得格式 yyyy-MM                     | string | -      |
| monthrange     | 月份区间类型，值得格式 yyyy-MM                 | string | -      |

### searchHelper

| 参数   | 说明                                                            | 类型                     | 默认值 |
| ------ | --------------------------------------------------------------- | ------------------------ | ------ |
| open   | 打开搜索帮助的前置钩子，返回 bool 类型，true 打开、false 不打开 | Function(formData): bool | -      |
| closed | 关闭搜索帮助的后置钩子，参数是带回的行数据                      | Function(tableData)      | -      |

### labelOption

| 参数      | 说明                                 | 类型    | 默认值 |
| --------- | ------------------------------------ | ------- | ------ |
| fieldName | 表单项字段 key                       | string  | -      |
| options   | 表单元素的外配置，[配置项](#options) | object  | -      |
| style     | 表单元素的 css 样式                  | object  | -      |
| disabled  | 是否禁用                             | boolean | false  |
| onChange  | checkbox 或 select 值变化的回调      | func    | -      |

### descOption

注意：描述信息会占据原有表单元素的部分空间，因此需要通过 list 配置项中的 style 来控制表单元素的宽度

| 参数      | 说明                            | 类型               | 默认值 |
| --------- | ------------------------------- | ------------------ | ------ |
| isTooltip | 是否以 Tooltip 形式显示描述信息 | boolean            | false  |
| style     | 描述文本容器的 css 样式         | object             | -      |
| content   | 描述信息的内容                  | string \| JSX Node | -      |

### request

`只对 SEARCH_HELPER|SELECT|MULTIPLE_SELECT 有效`

| 参数     | 说明                                | 类型   | 默认值 |
| -------- | ----------------------------------- | ------ | ------ |
| fetchApi | 请求的接口方法                      | func   | -      |
| params   | 接口的参数                          | object | -      |
| datakey  | 数据的 key，支持 `a.b.c` 的路径写法 | string | -      |
| valueKey | 数据值的字段名                      | string | value  |
| textKey  | 文本的字段名                        | string | text   |

### upload

`只对 UPLOAD_IMG|UPLOAD_FILE 有效`

| 参数         | 说明                                                         | 类型    | 默认值                               |
| ------------ | ------------------------------------------------------------ | ------- | ------------------------------------ |
| actionUrl    | 上传的地址，必要参数                                         | string  | -                                    |
| headers      | 接口请求的 header 头参数                                     | object  | -                                    |
| params       | 上传接口的参数                                               | object  | -                                    |
| limit        | 限制上传文件的数量                                           | number  | 1                                    |
| fixedSize    | 裁剪框的宽高比，只对 UPLOAD_IMG 有效                         | array   | [5, 4]                               |
| isCalcHeight | 是否根据裁剪图片宽高比自动计显示框高度，只对 UPLOAD_IMG 有效 | boolean | false                                |
| titles       | 上传图片对应的标题，个数与 limit 一致，只对 UPLOAD_IMG 有效  | array   | -                                    |
| fileTypes    | 限制上传附件的类型，只对 UPLOAD_FILE 有效                    | array   | ['jpg', 'png', 'pdf', 'xls', 'xlsx'] |
| fileSize     | 限制上传文件的大小，单位是 M，只对 UPLOAD_FILE 有效          | number  | 5                                    |

`文件上传前后端数据交互的格式`

| 参数 | 说明     | 类型   | 默认值 |
| ---- | -------- | ------ | ------ |
| name | 文件名称 | string | -      |
| url  | 文件地址 | string | -      |

### item

| 参数  | 说明         | 类型             | 默认值 |
| ----- | ------------ | ---------------- | ------ |
| text  | 列表项的文本 | string           | -      |
| value | 列表项的值   | string \| number | -      |

`示例代码`

```bash
# template
<template>
  <form-panel ref="formPanel" :initial-value="formValue" :list="formList" label-width="90" />
</template>

# js
export default {
  data() {
    return {
      formList: this.createFormList(),
      formValue: { p: '1' }
    };
  },
  methods: {
    createFormList() {
      return [
        {
          type: 'INPUT',
          label: '表单项1',
          fieldName: 'a',
          labelOptions: {
            fieldName: 'p',
            options: {
              itemList: [
                { text: '选项1', value: '1' },
                { text: '选项2', value: '2' }
              ]
            }
          },
          rules: [{ required: true, message: '请输入', trigger: 'blur' }]
        },
        {
          type: 'SELECT',
          label: '表单项2',
          fieldName: 'b',
          options: {
            itemList: [
              { text: '列表1', value: '1' },
              { text: '列表2', value: '2' }
            ],
            filterable: true
          }
        },
        {
          type: 'DATE',
          label: '表单项3',
          fieldName: 'c',
          options: {
            dateType: 'date'
          }
        },
        {
          type: 'INPUT',
          label: '表单项4',
          fieldName: 'd',
          style: { width: `calc(100% - 30px)` },
          descOptions: {
            isTooltip: true,
            content: `说明文字`
          }
        },
        {
          type: 'INPUT_NUMBER',
          label: '表单项5',
          fieldName: 'e',
          style: { width: `calc(100% - 30px)` },
          descOptions: {
            content: '元'
          }
        },
        {
          type: 'CHECKBOX',
          label: '表单项6',
          fieldName: 'f',
          options: {
            trueValue: '1',
            falseValue: '0'
          },
          onChange: val => {
            this.findFormItem('g').disabled = val === '1';
          }
        },
        {
          type: 'DATE',
          label: '表单项7',
          fieldName: 'g',
          options: {
            dateType: 'exactdate'
          }
        },
        {
          type: 'RANGE_INPUT_NUMBER',
          label: '表单项8',
          fieldName: 'h|i',
          options: {
            min: 1,
            max: 100
          }
        },
        {
          type: 'INPUT',
          label: '表单项9',
          fieldName: 'j'
        },
        {
          type: 'SELECT',
          label: '表单项11',
          fieldName: 'l',
          options: {
            filterable: true
          },
          request: {
            fetchApi: () => {},
            params: {},
            datakey: 'items',
            valueKey: 'id',
            textKey: 'name'
          }
        },
        {
          type: 'MULTIPLE_SELECT',
          label: '表单项12',
          fieldName: 'm',
          options: {
            itemList: [
              { text: '篮球', value: '1' },
              { text: '足球', value: '2' },
              { text: '乒乓球', value: '3' }
            ]
          }
        },
        {
          type: 'UPLOAD_FILE',
          label: '上传文件',
          fieldName: 'n',
          upload: {
            actionUrl: '/api/file/oss/upload',
            limit: 2,
            params: {},
            fileTypes: ['jpg', 'png']
          }
        },
        {
          type: 'UPLOAD_IMG',
          label: '上传图片',
          fieldName: 'o',
          upload: {
            actionUrl: '/api/file/oss/upload',
            fixedSize: [5, 3],
            isCalcHeight: true,
            limit: 1,
            params: {}
          }
        }
      ];
    }
  }
};
```
