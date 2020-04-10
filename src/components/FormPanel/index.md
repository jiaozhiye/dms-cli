## API

### FormPanel

| 参数            | 说明                                                           | 类型                | 默认值  |
| --------------- | -------------------------------------------------------------- | ------------------- | ------- |
| list            | 表单组件数据数组，[配置项](#option)，必要参数                  | array               | -       |
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
| SET_FIELDS_VALUE | 设置表单字段的值       | Function(values:ovject) | -                                             |
| GET_FORM_DATA    | 获取表单数据，异步方法 | -                       | 返回错误前置的数组 [error, formValue]         |

### option

| 参数       | 说明                              | 类型                                                                                                                                                                                                                                                                                                                                                        | 默认值 |
| ---------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| type       | 表单类型                          | INPUT \| INPUT_NUMBER \| RANGE_INPUT \| RANGE_INPUT_NUMBER \| INPUT_TREE \| SELECT \| MULTIPLE_SELECT \| CHECKBOX \| MULTIPLE_CHECKBOX \| DATE \| RANGE_DATE \| SEARCH_HELPER \| SEARCH_HELPER_WEB \| TEXT_AREA \| UPLOAD_IMG \| UPLOAD_FILE \| RADIO \| TIME \| RANGE_TIME \| TIME_SELECT \| RANGE_TIME_SELECT \| INPUT_CASCADER \| TINYMCE \| BREAK_SPACE | string | - |
| label      | 标题名称                          | string                                                                                                                                                                                                                                                                                                                                                      | -      |
| labelWidth | label 标签的的宽度，需要加单位 px | string                                                                                                                                                                                                                                                                                                                                                      | 80     |
| fieldName  | 字段名称 key                      | string                                                                                                                                                                                                                                                                                                                                                      | -      |
