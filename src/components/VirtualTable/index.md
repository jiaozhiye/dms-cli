## API

### Table

| 参数             | 说明                                      | 类型                                                   | 默认值  |
| ---------------- | ----------------------------------------- | ------------------------------------------------------ | ------- |
| columns          | 表格列的配置，[配置项](#column)，必要参数 | array                                                  | -       |
| columnsChange    | 表格列变化事件，必要参数                  | Function(columns)                                      | -       |
| dataSource       | 数据数组                                  | array                                                  | -       |
| rowKey           | 表格行 key 的取值，可以是字符串或一个函数 | string\|Function(row, index) => string                 | uid     |
| fetch            | 向后台请求数据的接口，[配置项](#fetch)    | object                                                 | -       |
| border           | 是否带有纵向边框                          | boolean                                                | true    |
| height           | 表格的高度，单位 px                       | number \| auto                                         | -       |
| maxHeight        | 表格的最大高度，单位 px                   | number                                                 | -       |
| loading          | 页面是否加载中                            | boolean                                                | false   |
| resizable        | 所有列是否允许拖动列宽调整大小            | boolean                                                | true    |
| size             | 表格尺寸                                  | default \| medium \| small \| mini                     | default |
| cacheColumnsKey  | 存储列配置的字段名，不能重复              | string                                                 | -       |
| showHeader       | 是否显示表头                              | boolean                                                | true    |
| ellipsis         | 设置所有内容过长时显示为省略号            | boolean                                                | true    |
| rowStyle         | 给行附加样式                              | object \| Function(row, rowIndex)                      | -       |
| cellStyle        | 给单元格附加样式                          | object \| Function(row, column, rowIndex, columnIndex) | -       |
| spanMethod       | 合并行或列的计算方法                      | Function({row, column, rowIndex, columnIndex})         | -       |
| rowSelection     | 列表项是否可选择，[配置项](#rowSelection) | object                                                 | -       |
| expandable       | 展开行配置项，[配置项](#expandable)       | object                                                 | -       |
| clientSorter     | 是否开启客户端表头排序                    | boolean                                                | true    |
| clientFilter     | 是否开启客户端表头筛选                    | boolean                                                | true    |
| showAlert        | 是否显示表格信息                          | boolean                                                | true    |
| showFullScreen   | 是否显示全屏按钮                          | boolean                                                | true    |
| showRefresh      | 是否显示刷新按钮                          | boolean                                                | true    |
| exportExcel      | 导出表格数据，[配置项](#exportExcel)      | object                                                 | -       |
| tablePrint       | 表格打印，[配置项](#tablePrint)           | object                                                 | -       |
| showColumnDefine | 是否显示列定义                            | boolean                                                | true    |

### 事件

| 事件名称    | 说明                       | 回调参数                                                                |
| ----------- | -------------------------- | ----------------------------------------------------------------------- |
| change      | 分页、排序、筛选变化时触发 | Function(pagination, filters, sorter, { currentDataSource: tableData }) |
| dataChange  | 表格数据变化时触发         | Function(tableData)                                                     |
| rowClick    | 行单击事件                 | Function(row, column, event)                                            |
| rowDblclick | 行双击事件                 | Function(row, column, event)                                            |

### 方法

| 方法名称         | 说明                                       | 参数 | 返回值                                    |
| ---------------- | ------------------------------------------ | ---- | ----------------------------------------- |
| CALCULATE_HEIGHT | 计算表格高度                               | -    | -                                         |
| DO_REFRESH       | 执行查询接口，刷新表格数据                 | -    | -                                         |
| GET_LOG          | 获取操作记录，非空校验、格式校验、更新记录 | -    | Function({ required, validate, updated }) |

### column

| 参数        | 说明                                           | 类型                                                         | 默认值 |
| ----------- | ---------------------------------------------- | ------------------------------------------------------------ | ------ |
| dataIndex   | 数据的 key，支持 `a.b.c` 的路径写法，必要参数  | string                                                       | -      |
| title       | 列头显示文字，必要参数                         | string                                                       | -      |
| width       | 列宽度/最小宽度                                | number                                                       | -      |
| fixed       | 列固定（IE 下无效）                            | left \| right                                                | -      |
| align       | 设置列的对齐方式                               | left \| center \| right                                      | left   |
| hidden      | 是否隐藏列                                     | boolean                                                      | false  |
| ellipsis    | 超过宽度将自动省略                             | boolean                                                      | false  |
| className   | 列样式类名                                     | string                                                       | -      |
| children    | 内嵌 children，以渲染分组表头                  | array                                                        |        |
| sorter      | 列排序                                         | boolean \| func                                              | -      |
| filter      | 列筛选，[配置项](#filter)                      | object                                                       | -      |
| precision   | 数值类型字段的精度                             | number                                                       | -      |
| formatType  | 字段的格式化类型，[配置项](#formatType)        | string                                                       | -      |
| required    | 可编辑列是否必填                               | boolean                                                      | false  |
| editRender  | 可编辑单元格，返回值请参考 [配置项](#editable) | Function(row, column):object                                 | -      |
| dictItems   | 数据字典配置，[配置项](#item)                  | array                                                        | -      |
| summation   | 底部合计，[配置项](#summation)                 | object                                                       | -      |
| render      | 列渲染方法                                     | Function(text, row, column, rowIndex, cellIndex) => JSX Node | -      |
| extraRender | 额外的列渲染方法，用于处理导出和打印数据       | Function(text, row, column, rowIndex, cellIndex):any         | -      |

### fetch

| 参数     | 说明                                | 类型    | 默认值 |
| -------- | ----------------------------------- | ------- | ------ |
| api      | ajax 接口，必要参数                 | func    | -      |
| params   | 接口参数，必要参数                  | object  | -      |
| xhrAbort | 是否取消请求                        | boolean | false  |
| dataKey  | 数据的 key，支持 `a.b.c` 的路径写法 | string  | items  |

### filter

| 参数  | 说明                                        | 类型   | 默认值 |
| ----- | ------------------------------------------- | ------ | ------ |
| type  | 列筛选类型，[配置项](#filterType)，必要参数 | string | -      |
| items | 筛选列表项，[配置项](#item)                 | array  | -      |

### filterType

| 参数         | 说明         |
| ------------ | ------------ |
| text         | 文本输入框   |
| checkbox     | 复选框       |
| radio        | 单选按钮     |
| number       | 数值输入框   |
| range-number | 数值区间     |
| date         | 日期类型     |
| range-date   | 日期区间类型 |

### editable

| 参数     | 说明                                        | 类型                            | 默认值 |
| -------- | ------------------------------------------- | ------------------------------- | ------ |
| type     | 可编辑类型，[配置项](#editType)，必要参数   | string                          | -      |
| items    | 下拉框的列表项，[配置项](#item)             | array                           | -      |
| editable | 是否可编辑                                  | boolean                         | -      |
| disabled | 是否禁用编辑功能，且禁止切换                | boolean                         | -      |
| extra    | 可编辑表单的额外配置项，[配置项](#extra)    | object                          | -      |
| rules    | 表单校验规则，数组值请参考[配置项](#rule)   | array                           | -      |
| onInput  | 表单的 input 事件                           | Function(cell, row)             | -      |
| onChange | 表单的 change 事件                          | Function(cell, row)             | -      |
| onEnter  | 表单的 enter 事件                           | Function(cell, row)             | -      |
| onClick  | 搜索帮助的单击事件，只对 search-helper 有效 | Function，[参数列表](#shParams) | -      |

### editType

| 参数            | 说明          |
| --------------- | ------------- |
| text            | 文本输入框    |
| number          | 数值输入框    |
| select          | 单选下拉框    |
| select-multiple | 多选下拉框    |
| checkbox        | 复选框        |
| search-helper   | 搜索帮助      |
| date            | 日期类型      |
| datetime        | 日期-时间类型 |

### shParams

| 参数   | 说明                                   | 类型                        | 默认值 |
| ------ | -------------------------------------- | --------------------------- | ------ |
| cell   | 单元格的值                             | object                      | -      |
| row    | 行数据                                 | object                      | -      |
| column | 列配置                                 | object                      | -      |
| cb     | 回调函数，设置单元格的值并触发表单校验 | Function(cellValue, others) | -      |
| event  | 单击事件的事件对象                     | object                      | -      |

### formatType

| 参数            | 说明          |
| --------------- | ------------- |
| date            | 日期类型      |
| datetime        | 日期-时间类型 |
| finance         | 金融格式      |
| secret-name     | 姓名保密      |
| secret-phone    | 电话保密      |
| secret-IDnumber | 身份证保密    |

### item

| 参数  | 说明         | 类型             | 默认值 |
| ----- | ------------ | ---------------- | ------ |
| text  | 列表项的文本 | string           | -      |
| value | 列表项的值   | string \| number | -      |

### extra

| 参数       | 说明               | 类型             | 默认值 |
| ---------- | ------------------ | ---------------- | ------ |
| maxlength  | 最大长度           | number           | -      |
| max        | 最大值             | number           | -      |
| min        | 最小值             | number           | -      |
| trueValue  | 针对 checkbox 生效 | string \| number | -      |
| falseValue | 针对 checkbox 生效 | string \| number | -      |
| text       | 显示的文本         | string           | -      |
| disabled   | 表单禁用状态       | boolean          | -      |

### rule

| 参数      | 说明           | 类型                           | 默认值 |
| --------- | -------------- | ------------------------------ | ------ |
| required  | 是否必填       | boolean                        | -      |
| message   | 提示信息       | string                         | -      |
| validator | 自定义校验规则 | Function(cellValue) => boolean | -      |

### summation

| 参数      | 说明                                            | 类型                   | 默认值 |
| --------- | ----------------------------------------------- | ---------------------- | ------ |
| dataIndex | 服务端合计，数据的 key，建议和列 dataIndex 一致 | string                 | -      |
| unit      | 合计字段的单位                                  | string                 | -      |
| onChange  | 字段合计变化时触发                              | Function(value:number) | -      |

### rowSelection

| 参数            | 说明                 | 类型                          | 默认值 |
| --------------- | -------------------- | ----------------------------- | ------ |
| type            | 选择类型，必要参数   | checkbox \| radio             | -      |
| selectedRowKeys | 选中项的 key 数组    | array                         | -      |
| rowSelectable   | 是否允许行选择       | Function(row) => boolean      | -      |
| onChange        | 选中项发生变化时触发 | Function(selectionKeys:array) | -      |

### expandable

| 参数                 | 说明                           | 类型                       | 默认值 |
| -------------------- | ------------------------------ | -------------------------- | ------ |
| defaultExpandAllRows | 默认展开所有行                 | boolean                    | -      |
| rowExpandable        | 是否允许行展开                 | Function(row) => boolean   | -      |
| expandedRowRender    | 额外的展开行渲染方法，必要参数 | Function(row) => JSX Node  | -      |
| onChange             | 展开的行变化时触发             | Function({ rowKey: bool }) | -      |

### exportExcel

| 参数     | 说明                                          | 类型   | 默认值 |
| -------- | --------------------------------------------- | ------ | ------ |
| fileName | 导出的文件名，需包含扩展名 xlsx/csv，必要参数 | string | -      |

### tablePrint

| 参数     | 说明                | 类型    | 默认值 |
| -------- | ------------------- | ------- | ------ |
| showLogo | 是否显示打印单 logo | boolean | true   |

## 注意

在 Table 中，`dataSource` 和 `columns` 里的数据值都需要指定 `key` 值。对于 `dataSource` 默认将每列数据的 `key` 属性作为唯一的标识。

如果你的数据没有这个属性，务必使用 `rowKey` 来指定数据列的主键。若没有指定，控制台会出现缺少 key 的提示，表格组件也会出现各类奇怪的错误。

```bash
// 比如你的数据主键是 uid
return <Table rowKey="uid" />;
// 或
return <Table rowKey={record => record.uid} />;
```
