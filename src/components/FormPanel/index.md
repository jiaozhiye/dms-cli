## API

### FormPanel

| 参数            | 说明                                                           | 类型                | 默认值  |
| --------------- | -------------------------------------------------------------- | ------------------- | ------- |
| list            | 表单组件数据数组，[配置项](#formItem)，必要参数                | array               | -       |
| initialValue    | 表单组件的初始值，只在组件首次加载时生效                       | obkect              | -       |
| formType        | 表单的类型                                                     | default \| onlyShow | default |
| cols            | 每行显示的列数，只能是被 24 整除的值                           | number              | 3       |
| labelWidth      | label 标签的宽度，单位 px                                      | number              | 80      |
| scrollContainer | 具有滚动条的容器，需要具有定位属性，用于表单校验信息的锚点定位 | HTMLNode            | -       |
| isSubmitBtn     | 是否显示保存、重置按钮                                         | boolean             | false   |

### 事件

| 事件名称 | 说明                 | 回调参数                   |
| -------- | -------------------- | -------------------------- |
| change   | 表单提交，触发的事件 | Function(formValue:object) |

### 方法

| 方法名称         | 说明                   | 参数                    | 返回值                                        |
| ---------------- | ---------------------- | ----------------------- | --------------------------------------------- |
| SUBMIT_FORM      | 执行表单提交           | -                       | 通过校验，返回表单对象；未通过校验，返回 null |
| RESET_FORM       | 重置表单控件           | -                       | -                                             |
| SET_FIELDS_VALUE | 设置表单字段的值       | Function(values:object) | -                                             |
| GET_FORM_DATA    | 获取表单数据，异步方法 | -                       | 返回错误前置的数组 [error, formValue]         |

### formItem

| 参数            | 说明                                           | 类型                | 默认值   |
| --------------- | ---------------------------------------------- | ------------------- | -------- |
| type            | 表单类型                                       | [配置项](#formType) | string   | - |
| label           | 标题名称                                       | string              | -        |
| labelWidth      | label 标签的的宽度，需要加单位 px              | string              | 80       |
| fieldName       | 表单项字段 key                                 | string              | -        |
| style           | 表单元素的 css 样式                            | object              | -        |
| rules           | 表单校验规则，用法请参考 Element-Ui            | array               | -        |
| placeholder     | 表单元素的提示文字                             | string              | -        |
| readonly        | 是否只读                                       | boolean             | false    |
| disabled        | 是否禁用                                       | boolean             | false    |
| hidden          | 是否隐藏表单项                                 | boolean             | false    |
| clearable       | 是否开启擦除按钮                               | boolean             | true     |
| noResetable     | 设置表单项是否会被重置                         | boolean             | false    |
| selfCols        | 表单元素自身占据的列数                         | number              | 1        |
| offsetLeftCols  | 表单元素左侧的间隔列数                         | number              | 1        |
| offsetRightCols | 表单元素右侧的间隔列数                         | number              | 1        |
| options         | 表单元素的外配置，[配置项](#options)           | object              | -        |
| request         | 表单项的 ajax 请求配置，[配置项](#request)     | object              | -        |
| upload          | 表单附件上传的配置，[配置项](#upload)          | object              | -        |
| labelOptions    | label 标签的自定义渲染，[配置项](#labelOption) | object              | -        |
| descOptions     | 描述信息的自定义渲染，[配置项](#descOption)    | object              | -        |
| render          | 表单元素的渲染方法                             | func                | JSX Node |

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

### options

| 参数       | 说明                             | 类型 | 默认值   |
| ---------- | -------------------------------- | ---- | -------- |
| unitRender | 输入框后置内容的渲染方法 - INPUT | func | JSX Node |

### labelOption

| 参数      | 说明                              | 类型    | 默认值 |
| --------- | --------------------------------- | ------- | ------ |
| fieldName | 表单项字段 key                    | string  | -      |
| itemList  | 下拉框的数据列表，[配置项](#item) | array   | -      |
| style     | 表单元素的 css 样式               | object  | -      |
| disabled  | 是否禁用                          | boolean | false  |
| onChange  | checkbox 或 select 值变化的回调   | func    | -      |

### descOption

注意：描述信息会占据原有表单元素的部分空间，因此需要通过 list 配置项中的 style 来控制表单元素的宽度

| 参数      | 说明                            | 类型    | 默认值 |
| --------- | ------------------------------- | ------- | ------ |
| isTooltip | 是否以 Tooltip 形式显示描述信息 | boolean | false  |
| style     | 描述文本容器的 css 样式         | object  | -      |
| content   | 描述信息的内容                  | string  | -      |

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
