## API

### BaseTable

| 参数               | 说明                                                                                | 类型                                           | 默认值   |
| ------------------ | ----------------------------------------------------------------------------------- | ---------------------------------------------- | -------- |
| height             | Table 的高度；不设置，自适应屏幕高度；如果设置为 auto，高度随着内容递增             | number \| string                               | -        |
| maxHeight          | Table 的最大高度                                                                    | number \| string                               | -        |
| columns            | 表格列的配置描述，[配置项](#column)，必要参数                                       | array                                          | -        |
| columnsRef         | 存储列配置的字段名，不能重复                                                        | string                                         | -        |
| dataSource         | 数据数组                                                                            | array                                          | -        |
| fetchapi           | 请求数据的接口                                                                      | func                                           | -        |
| params             | 接口参数，[配置项](#params)                                                         | object                                         | -        |
| isServerSorter     | 是否开启服务端表头排序                                                              | boolean                                        |          |
| isServerFilter     | 是否开启服务端表头筛选                                                              | boolean                                        |          |
| rowstyles          | 设置列表行的样式，格式 [{ row: 行数据, styles: 样式集合 }, ...]}                    | array                                          | -        |
| cellstyles         | 设置单元格的样式，格式 [{ row: 行数据, dataIndex: 列的 key, styles: 样式集合, ...]} | array                                          | -        |
| selectionType      | 行选择类型                                                                          | multiple \| single                             | multiple |
| isSelectColumn     | 是否显示可选择的列                                                                  | boolean                                        | true     |
| defaultSelections  | 默认选中项，格式 [行数据, ...]                                                      | array                                          | -        |
| isToperInfo        | 是否显示顶部信息                                                                    | boolean                                        | true     |
| isExportExcel      | 是否显示导出功能                                                                    | boolean                                        | true     |
| isColumnFilter     | 是否显示列定义                                                                      | boolean                                        | true     |
| isPagination       | 是否显示分页，在 dataSource 模式下不显示分页                                        | boolean                                        | true     |
| isMemoryPagination | 是否为内存分页，只在 dataSource 模式下生效                                          | boolean                                        | false    |
| uidkey             | 表格行 key 的取值                                                                   | string                                         | uid      |
| datakey            | 数据的 key，支持 `a.b.c` 的路径写法                                                 | string                                         | items    |
| exportFileName     | 出文件的文件名                                                                      | string                                         | -        |
| mergeCellMethod    | 合并行或列的计算方法                                                                | Function({row, column, rowIndex, columnIndex}) | -        |
| onColumnsChange    | 表格列变化事件，必要参数                                                            | Function(columns)                              | -        |
| onEnterEvent       | 单元格在有焦点状态下的回车事件和行双击事件的监听函数                                | Function(row)                                  | -        |
| onRowSelectChange  | 行选中状态变化时的回调                                                              | Function(rows)                                 | -        |
| onCellChange       | 单元格数据变化时的回调                                                              | Function(cellValue, row)                       | -        |
| onSummationChange  | 表格合计变化时的回调                                                                | Function([合计字段, ...])                      | -        |
| onPageChange       | 分页变化时的回调                                                                    | Function(pagination)                           | -        |
| onCalcExportData   | 计算处理导出数据的额外方法                                                          | Function(row)                                  | -        |
| onSyncTableData    | 表格数据变化时触发                                                                  | Function(tableData, state:是否为首次同步数据)  | -        |

### column

| 参数                | 说明                                                          | 类型                                                                   | 默认值 |
| ------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------- | ------ |
| dataIndex           | 列数据在数据项中对应的 key，支持 `a.b.c` 的路径写法，必要参数 | string                                                                 | -      |
| title               | 列头显示文字，必要参数                                        | string                                                                 | -      |
| children            | 内嵌 children，以渲染分组表头                                 | array                                                                  | -      |
| hidden              | 是否隐藏该列                                                  | boolean                                                                | false  |
| width               | 列宽度                                                        | number \| string                                                       | -      |
| minWidth            | 列最小宽度                                                    | number \| string                                                       | -      |
| maxlength           | 输入框最大输入长度                                            | number                                                                 | -      |
| max                 | 最大值                                                        | number                                                                 | -      |
| min                 | 最小值                                                        | number                                                                 | -      |
| precision           | 单元格、合计的数值精度                                        | number                                                                 | -      |
| fixed               | 列固定                                                        | left \| right                                                          | -      |
| align               | 单元格文字对齐方式                                            | left \| center \| right                                                | left   |
| dictItems           | 数据字典配置，[配置项](#item)                                 | array                                                                  | -      |
| className           | 单元格附加的类属性，用于修改某单元格列样式                    | string                                                                 | -      |
| showOverflowTooltip | 内容过长被隐藏时显示 tooltip                                  | boolean                                                                | false  |
| dateFormat          | 指定日期格式，具体请参考 element-ui date-picker 组件          | string                                                                 | -      |
| minDateTime         | 最小日期，小于该时间的日期段将被禁用                          | tring \| 列的 dataIndex                                                | -      |
| maxDateTime         | 最大日期，大于该时间的日期段将被禁用                          | tring \| 列的 dataIndex                                                | -      |
| numberFormat        | 指定单元格为金融类数值格式                                    | boolean                                                                | false  |
| summation           | 字段底部合计                                                  | boolean                                                                | false  |
| summationDataIndex  | 服务端合计的字段名，建议和列 dataIndex 一致                   | string                                                                 | -      |
| summationUnit       | 合计字段的单位                                                | string                                                                 | -      |
| secretType          | 字段值的保密类型                                              | name \| phone \| IDnumber                                              | -      |
| stopRowSelection    | 该列在单击时，是否阻止行选中行为                              | boolean                                                                | false  |
| sorter              | 是否支持排序，支持自定义排序规则                              | boolean \| func                                                        | -      |
| filter              | 是否支持表头过滤                                              | boolean                                                                | false  |
| filterType          | 表头过滤类型                                                  | input \| number \| checkbox \| radio \| date-range                     | -      |
| filterItems         | 表头过滤的列表数据，[配置项](#item)                           | array                                                                  | -      |
| editable            | 列单元格是否可编辑                                            | boolean                                                                | false  |
| defaultEditable     | 该列单元格是否处于可编辑状态                                  | boolean                                                                | false  |
| editType            | 单元格的编辑类型                                              | text \| number \| select \| select-multiple \| checkbox \| date-picker | -      |
| editRequired        | 校验单元格是否必填，表头标题会有红色星号提示                  | boolean                                                                | false  |
| editPattern         | 单元格内容格式的正则校验                                      | regExp                                                                 | -      |
| editItems           | 下拉框类型单元格的列表数据，[配置项](#item)                   | array                                                                  | -      |
| disabled            | 可编辑单元格的禁用状态                                        | boolean                                                                | false  |
| editDisableRender   | 可编辑的单元格在强制指定不可编辑状态下的渲染函数              | Function(单元格作用域对象) => JSX Node                                 | -      |
| onChange            | 表单的 change 事件                                            | Function(cellValue, row)                                               | -      |
| onInput             | 表单的 input 事件                                             | Function(cellValue, row)                                               | -      |
| searchHelper        | 单元格搜索帮助配置，[配置项](#searchHelper)                   | object                                                                 | -      |
| render              | 列渲染方法                                                    | Function(单元格作用域对象) => JSX Node                                 | -      |

### params

| 参数     | 说明                                             | 类型    | 默认值 |
| -------- | ------------------------------------------------ | ------- | ------ |
| xhrAbort | 是否取消请求                                     | boolean | false  |
| noJumper | 分页是否跳转，true: 表示当前查询不会跳回到第一页 | boolean | false  |

### item

| 参数       | 说明                           | 类型             | 默认值 |
| ---------- | ------------------------------ | ---------------- | ------ |
| text       | 列表项的文本                   | string           | -      |
| value      | 列表项的值                     | string \| number | -      |
| trueValue  | 选中的值，只对 checkbox 有效   | string \| number | -      |
| falseValue | 非选中的值，只对 checkbox 有效 | string \| number | -      |

### searchHelper

| 参数         | 说明                                                                                         | 类型    | 默认值 |
| ------------ | -------------------------------------------------------------------------------------------- | ------- | ------ |
| fetchApi     | 搜索帮助的接口函数                                                                           | func    | -      |
| params       | 接口的额外参数                                                                               | object  | -      |
| datakey      | 接口数据的 key，支持 `a.b.c` 的路径写法                                                      | string  | -      |
| supportInput | 是否支持自定义的输入值                                                                       | boolean | false  |
| aliasKey     | 搜索帮助字段配置项，格式 {搜索帮助的数据 key: { dataIndex: 列的 dataIndex, disabled: bool }} | object  | -      |

注意：disabled 表示在搜索帮助的弹出面板中是否可见，不影响单元格的联动赋值；当前列（column）的 dataIndex 必须配置在 aliasKey 中，最好放在一项。

### 方法

| 方法名称                | 说明                                     | 参数                                                                    | 返回值                 |
| ----------------------- | ---------------------------------------- | ----------------------------------------------------------------------- | ---------------------- |
| SET_TABLE_DATA          | 设置表格数据                             | Function(tableData:array)                                               | -                      |
| DO_REFRESH              | 刷新表格数据，只对 fetchapi 模式生效     | -                                                                       |
| EXECUTE_INSERT          | 执行插入列表行操作                       | Function(新增行的对象或数组, 插入的位置 top/bottom(默认))               | -                      |
| EXECUTE_DELETE          | 执行移除列表选中行的操作                 | Function(行数据的数组(可选))                                            | 移除行组成的数组       |
| EXECUTE_RESET_HEIGHT    | 重新计算并设置组件高度                   | -                                                                       | -                      |
| SET_COLUMNS_EDITABLE    | 动态设置 table 列的编辑状态              | Function(dataIndex 或由 dataIndex 组成的数组, 可编辑状态(true/false))   | -                      |
| SET_CELL_DISABLED       | 动态设置可编辑列单元格的禁用状态         | Function(row 或由 row 组成的数组, 列的 dataIndex, 是否禁用(true/false)) | -                      |
| SET_CELL_UNEDITABLE     | 强制设置单元格可编辑或不可编辑           | Function(row 或由 row 组成的数组, 列的 dataIndex, 状态值(true/false))   | -                      |
| START_LOADING           | 开启组件 loading 状态                    | -                                                                       | -                      |
| STOP_LOADING            | 关闭组件 loading 状态                    | -                                                                       | -                      |
| CLEAR_EXECUTE_LOG       | 清空之前对组件的 CURD 操作记录           | -                                                                       | -                      |
| SET_DISABLE_SELECT      | 动态设置行数据的不可选择状态             | Function(row 或由 row 组成的数组)                                       | -                      |
| GET_UPDATE_ROWS         | 可编辑单元格值改变所对应的行             | -                                                                       | 数据行组成的数组       |
| GET_INSERT_ROWS         | 记录新增的行                             | -                                                                       | 数据行组成的数组       |
| GET_DELETE_ROWS         | 记录移除的行                             | -                                                                       | 被移除数据行组成的数组 |
| GET_REQUIRED_ERROR      | 记录可编辑单元格的非空校验，用于保存提示 | -                                                                       | object \| null         |
| GET_FORMAT_ERROR        | 记录可编辑单元格的格式校验，用于保存提示 | object \| null                                                          |
| GET_SEARCH_HELPER_ERROR | 记录搜索帮助的非法操作，用于保存提示     | object \| null                                                          |

### 插槽

| 插槽名称    | 说明         |
| ----------- | ------------ |
| moreActions | 更多操作配置 |
| controls    | 控制操作区域 |
