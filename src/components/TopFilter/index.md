## API

### TopFilter

| 参数         | 说明                                            | 类型    | 默认值 |
| ------------ | ----------------------------------------------- | ------- | ------ |
| list         | 表单组件数据数组，[配置项](#formItem)，必要参数 | array   | -      |
| initialValue | 表单组件的初始值，只在组件首次加载时生效        | obkect  | -      |
| defaultRows  | 收起状态默认显示的行数                          | number  | 1      |
| cols         | 每行显示的列数，只能是被 24 整除的值            | number  | 3      |
| labelWidth   | label 标签的宽度，单位 px                       | number  | 80     |
| isSubmitBtn  | 是否显示 搜索/重置 按钮                         | boolean | true   |
| isDisabled   | 是否禁用搜索按钮                                | boolean | false  |
| isCollapse   | 是否显示展开/收起按钮                           | boolean | true   |

### 事件

| 事件名称       | 说明                 | 回调参数                   |
| -------------- | -------------------- | -------------------------- |
| change         | 搜索提交，触发的事件 | Function(formValue:object) |
| collapseChange | 展开/收起变化时触发  | Function(state:boolean)    |

### 方法

| 方法名称         | 说明                   | 参数                    | 返回值                                        |
| ---------------- | ---------------------- | ----------------------- | --------------------------------------------- |
| SUBMIT_FORM      | 执行表单提交           | -                       | 通过校验，返回表单对象；未通过校验，返回 null |
| RESET_FORM       | 重置表单控件           | -                       | -                                             |
| SET_FIELDS_VALUE | 设置表单字段的值       | Function(values:object) | -                                             |
| GET_FORM_DATA    | 获取表单数据，异步方法 | -                       | 返回错误前置的数组 [error, formValue]         |

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

### formItem

| 参数         | 说明                                           | 类型                | 默认值   |
| ------------ | ---------------------------------------------- | ------------------- | -------- |
| type         | 表单类型                                       | [配置项](#formType) | string   | - |
| label        | 标题名称                                       | string              | -        |
| labelWidth   | label 标签的的宽度，需要加单位 px              | string              | 80       |
| fieldName    | 表单项字段 key                                 | string              | -        |
| style        | 表单元素的 css 样式                            | object              | -        |
| rules        | 表单校验规则，用法请参考 Element-Ui            | array               | -        |
| placeholder  | 表单元素的提示文字                             | string              | -        |
| readonly     | 是否只读                                       | boolean             | false    |
| disabled     | 是否禁用                                       | boolean             | false    |
| hidden       | 是否隐藏表单项                                 | boolean             | false    |
| clearable    | 是否开启擦除按钮                               | boolean             | true     |
| noResetable  | 设置表单项是否会被重置                         | boolean             | false    |
| options      | 表单元素的外配置，[配置项](#options)           | object              | -        |
| request      | 表单项的 ajax 请求配置，[配置项](#request)     | object              | -        |
| labelOptions | label 标签的自定义渲染，[配置项](#labelOption) | object              | -        |
| descOptions  | 描述信息的自定义渲染，[配置项](#descOption)    | object              | -        |
| render       | 表单元素的渲染方法                             | func                | JSX Node |
| onChange     | 表单元素值变化的回调                           | func                | -        |

### options

| 参数        | 说明                                                          | 类型   | 默认值   |
| ----------- | ------------------------------------------------------------- | ------ | -------- |
| itemList    | 下拉框的列表数据，[配置项](#item) - SELECT/MULTIPLE_CHECKBOX  | array  | -        |
| filterable  | 是否开启下拉框的拼音头快速检索功能 - SELECT/MULTIPLE_CHECKBOX | bool   | false    |
| limit       | 最多可以选择的项目数 - MULTIPLE_SELECT/MULTIPLE_CHECKBOX      | number | -        |
| rows        | 文本域的行数 - TEXT_AREA                                      | number | -        |
| minlength   | 原生属性，最小输入长度 - INPUT                                | number | 0        |
| maxlength   | 原生属性，最大输入长度 - INPUT/TEXT_AREA                      | number | 200      |
| min         | 最小值 - INPUT_NUMBER/RANGE_INPUT_NUMBER                      | number | 0        |
| max         | 最大值 - INPUT_NUMBER/RANGE_INPUT_NUMBER                      | number |          |
| step        | 数值变化的步长 - INPUT_NUMBER/RANGE_INPUT_NUMBER              | number | 1        |
| precision   | 数值精度 - INPUT_NUMBER/RANGE_INPUT_NUMBER                    | number | -        |
| dateType    | 日期控件的类型，[配置项](#dateType) - DATE/RANGE_DATE         | string | -        |
| minDateTime | 最小日期，小于该时间的日期段将被禁用                          | string | -        |
| maxDateTime | 最大日期，大于该时间的日期段将被禁用                          | string | -        |
| defaultTime | 默认的时间，格式 HH:mm:ss                                     | string | -        |
| titles      | 级联选择器的标题，数组元素为字符串类型 - INPUT_CASCADER       | array  | -        |
| onInput     | 输入框 input 事件的回调 - INPUT                               | func   | -        |
| onFocus     | 输入框获得焦点事件的回调 - INPUT                              | func   | -        |
| unitRender  | 输入框后置内容的渲染方法 - INPUT                              | func   | JSX Node |

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

### item

| 参数  | 说明         | 类型             | 默认值 |
| ----- | ------------ | ---------------- | ------ |
| text  | 列表项的文本 | string           | -      |
| value | 列表项的值   | string \| number | -      |
