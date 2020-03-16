<h1 align="center">
  A Vue BaseTable Component by jzy
</h1>

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:8080
$ npm run dev

# build for production with minification
$ npm run build

# 演示路由
http://localhost:8080/table
```

## 说明文档

1. element-ui >= 2.8.0 版本
2. vue >= 2.5.0 版本
3. 需要工程支持 vue JSX 语法
4. 组件依赖一些其他文件，在把组件整合到工程中时需要引入，.env 文件无需引入
5. config/index.js 中 table 属性作为组件的全局配置，可切换服务端表头筛选和排序

## 支持的功能

- 表格数据来源支持传入 ajax 接口方法和直接传入数据（对象或数组）两种方式，需要配置好 datakey 及 uidkey
- 支持表格基本信息展示，比如总记录数和选中行数
- 支持对表格列的筛选（显示/隐藏）和拖拽排序功能
- 支持表格组件头部区域扩展自定义布局（组件插槽）
- 支持多级表头
- 支持表格列的动态渲染
- 支持表格的批量操作
- 支持表格数据导出 Excel
- 支持表头的筛选和排序，并支持扩展为服务端筛选和排序
- 支持表格行的选中（多选/单选），并支持默认选中
- 支持表格分页的显示和隐藏
- 支持内存分页(前端分页)
- 实现了表格组件的高度自适应及手动设置高度
- 支持表头字段的本地缓存，保留用户操作列筛选排序的记录
- 支持根据表头标题字数自动计算列宽度，避免表头文字多行显示
- 支持表格列的合计功能
- 支持表格行或列的合并功能
- 支持可选择列的排序和隐藏功能
- 支持单元格的自定义渲染及事件绑定功能
- 支持单元格的可编辑功能，触发方式为单元格单击或键盘事件（上下左右/回车/ESC）
- 支持键盘事件对单元格的自动获得焦点及全选功能
- 支持表格行双击事件
- 支持单元格内容格式校验，及非空校验
- 支持数据列（column）所有属性的动态赋值和切换
- 支持单元格的搜索帮助功能，支持联动多个单元格数据的改变
- 支持新增行和移除行的功能
- 支持 columns 变化时的回调，单元格数据变化时的回调，行选中状态变化时的回调，同步组件列表数据的回调
- 单元格的渲染函数 render 需要返回 JSX 类型节点

#### BaseTable 组件调用

`关于列表行数据的说明`

- 整体表格数据是一个数组，每一行数据为 json 对象
- 组件会自动为每条记录添加 \_uid，index，\$index 三个属性
- \_uid：唯一不重复的字段 key
- index：数据列表的序号，从 0 开始
- \$index：当前数据行所对应的索引值，时刻同步表格的筛选和排序

`FilterTable 组件参数API`

- height{Number/String|设置 table 组件的高度，如果不设置，为自适应屏幕高度，如果值是 auto，高度随着内容递增}
- maxHeight{Number/String|设置 table 最大高度}
- columns{Array|table 列配置数组}
- columnsRef{String|定义表头列字段的引用，用户保存列筛选排序的操作记录，不能重复}
- dataSource{Array|table 数据数据，对象或数组}
- fetchapi{Function|ajax 请求数据接口，参数是筛选条件及分页信息组成的 json 对象}
- params{Object|表格上方筛选条件的参数，json 对象}
  - params 中如果有 xhrAbort 属性，并且值是 true，表示取消 ajax 请求
  - params 中如果有 noJumper 属性，并且值是 true，表示当前查询不会跳回到第一页
- isServerSorter{Boolean|是否开启服务端表头排序}
- isServerFilter{Boolean|是否开启服务端表头筛选}
- rowstyles{Array|动态指定列表行的样式[{ row: 行数据, styles: {color: 'red'} }, ...]}
- cellstyles{Array|动态指定单元格的样式[{ row: 行数据, dataIndex: 'xxx', styles: {backgroundColor: 'red'} }, ...]}
- selectionType{String|table 行选中类型，multiple/single, 默认是多选}
- isSelectColumn{Boolean|是否显示可选择的列，默认显示可选择列}
- defaultSelections{Array|默认选中列表行}
- isToperInfo{Boolean|是否显示组件的基础信息}
- isExportExcel{Boolean|是否显示组件的导出功能}
- isColumnFilter{Boolean|是否显示组件的列筛选排序}
- isPagination{Boolean|是否显示分页，默认显示分页，但在 dataSource 的模式下不显示分页}
- isMemoryPagination{Boolean|是否为内存分页，默认 false}
- uidkey{String|服务端响应数据每条记录的 uuid，默认值是'uid'}
- datakey{String|服务端响应数据的数组列表对应的 key，支持路径操作('step1.step2.items')，默认值是'items'}
- exportFileName{String|导出文件的文件名，默认值是 表格数据.xlsx}
- mergeCellMethod{Function|合并行或列，具体请参考 element-ui table 组件}
- onColumnsChange{Function|columns 变化时的回调，参数是 columns 数组}
- onEnterEvent{Function|单元格在有焦点状态下的回车事件和行双击事件的监听函数，参数是当前单元格对应的行数据}
- onRowSelectChange{Function|table 行选中状态变化时的回调，参数是选中行记录的数组]}
- onCellChange{Function|table 单元格数据变化时的回调，参数 1 -> 被改变单元的的对象{`uid|dataIndex`: val}，参数 2 -> 被改变单元格所对应行的对象}
- onSummationChange{Function|表格合计变化时的回调，参数是合计字段对应的数组数据}
- onPageChange{Function|分页变化时的回调，参数是分页信息对象}
- onCalcExportData{Function|计算处理导出数据的额外方法，参数是行数据}
- onSyncTableData{Function|同步 table 组件列表数据，参数 1 -> 组件的数据列表，参数 2 -> 是否为首次同步的新数据，通常用来处理和数据相关的始化工作；数据的传递为单向数据流，如页面需要列表数据，必须通过此方式实现}

`FilterTable 组件槽口`

- slot：moreActions{String|普通插槽，更多操作}

- slot：controls{String|作用域插槽，控制操作区}
- slot-scope：props{Object|插槽参数}
  - data{Array|table 数据数组}
  - methods{Object|操作组件方法的集合}
    - addRecordFunc{Function|新增行，参数是符合表格行数据的对象}
    - delRecordFunc{Function|移除行，前端 dom 删除操作，返回值是被移除行所组成的数组}

`columns 字段配置项`

- title{String|表头文本}
- dataIndex{String|非空，数据记录 key 值，支持属性路径形式}
- children{Array|表格的多级表头，数组中元素的格式同外层 column}
- hidden{Boolean|是否隐藏该列，不配置默认显示}
- width{Number|列宽度}
- minWidth{Number|列最小宽度}
- maxlength{Number|最大输入长度}
- max{Number|最大值}
- min{Number|最小值}
- precision{Number|单元格或合计的数值精度，保留几位小数}
- fixed{String|列固定，值为 left/right}
- align{String|单元格文字对齐方式，left(默认)/center/right}
- dictItems{Array|数据字典的列表，用于翻译单元格字段，格式为 [{text: 'xxx', value: 1}, ...]}
- className{String|单元格追加的 class，用于修改某单元格列样式}
- showOverflowTooltip{Boolean|内容过长被隐藏时显示 tooltip}
- dateFormat{String|指定日期格式，具体请参考 element-ui date-picker 组件}
- minDateTime{String/其它列的 dataIndex|最小日期，小于该时间的日期段将被禁用}
- maxDateTime{String/其它列的 dataIndex|最大日期，大于该时间的日期段将被禁用}
- numberFormat{Boolean|指定金融类数值格式，100,000,000}
- summation{Boolean|字段合计}
- summationDataIndex{String|服务端合计的字段名，通常和 dataIndex 一致，如果设置为服务端合计，那么在对应列单元格数据变化时，合计值不变}
- summationUnit{String|合计字段的单位}
- secretType{String|字段值的保密类型，可选参数 name/phone/IDnumber}
- stopRowSelection{Boolean|该列在单击时，是否阻止行选中行为}
- sorter{Boolean/Function|是否支持排序，支持自定义排序规则}
- filter{Boolean|是否支持表头过滤}
- filterType{String|表头过滤类型，支持 input/number/checkbox/radio/date-range}
- filterItems{Array|checkbox 过滤类型的列表数据，[{text: '', value: ''}]}
- editable{Boolean|该列单元格是否可编辑}
- defaultEditable{Boolean|该列单元格是否处于可编辑状态}
- editType{String|单元格的编辑类型，支持 text/number/select/select-multiple/checkbox/date-picker}
- editRequired{Boolean|校验单元格是否必填，表头标题会有红色星号提示}
- editPattern{RegExp|单元格内容格式校验，/^[0-9a-zA-Z ]+\$/}
- editItems{Array|select 或 select-multiple 类型单元格编辑下拉框的数据 [{text: '', value: ''}]；checkbox 类型的单元格编辑的数据 [{text: '', trueValue: ''}, {text: '', falseValue: ''}]}
- disabled{Boolean|指定可编辑单元格的禁用状态，默认是 false}
- editDisableRender{Function|可编辑的单元格在强制指定不可编辑状态下的渲染函数，参数是当前单元格作用域对象，返回值是 JSX 类型节点}
- onChange{Function|单元格的值变化的事件，针对所有可编辑类型都生效，参数 1 -> {`uid|dataIndex`: val}，参数 2 -> 行数据}
- onInput{Function|输入框类型的单元格，输入变化的 input 事件，参数 1 -> {`uid|dataIndex`: val}，参数 2 -> 行数据}
- searchHelper{Object|单元格搜索帮助}
  - 搜索帮助的配置：
  - {
  - &emsp;fetchApi: {Function|搜索帮助的接口函数}
  - &emsp;params: {Object|接口的默认参数}
  - &emsp;datakey: {String|服务端响应数据的数组列表的 key，支持路径操作('step1.step2.items')，不指定表示 res.data 就是数组数据}
  - &emsp;// 把服务端数据映射成组件可用数据
  - &emsp;supportInput: {Boolean|是否支持自定义的输入值，默认不支持}
  - &emsp;// key -> 数据字段名 value -> json 对象，dataIndex 的值就是 column 的 dataIndex，disabled 表示在搜索帮助的弹出面板中是否可见，不影响单元格的联动赋值
  - &emsp;// 注意：当前列（column）的 dataIndex 必须配置在 aliasKey 中，最好放在一项
  - &emsp;aliasKey: {name: { dataIndex: 'person.name' }, price: { dataIndex: 'price', disabled: true }}
  - }
- render{Function|单元格作用域插槽渲染函数，参数是当前单元格作用域对象，返回值是 JSX 类型节点}

`FilterTable 组件暴露的方法`

- SET_TABLE_DATA{Function|设置表格数据，参数是数据列表的数组}
- DO_REFRESH{Function|执行 table 组件的刷新动作，参数是 true/false(可选)，表示是否跳回第一页}
- EXECUTE_INSERT{Function|执行插入列表行操作，参数 1: 新增行的对象或数组，参数 2: 插入的位置 top/bottom，默认是 bottom}
- EXECUTE_DELETE{Function|执行移除列表选中行的操作，参数是行数据的数组(可选)，返回值是移除行组成的数组}
- EXECUTE_RESET_HEIGHT{Function|重新计算并设置 table 组件高度，没有参数}
- SET_COLUMNS_EDITABLE{Function|动态设置 table 列的编辑状态，参数 1: dataIndex 或由 dataIndex 组成的数组，参数 2: 可编辑状态(true/false)}
- SET_CELL_DISABLED{Function|动态设置可编辑列单元格的禁用状态，参数 1: row 或由 row 组成的数组，参数 2: dataIndex，参数 3: 是否禁用(true/false)}
- SET_CELL_UNEDITABLE{Function|强制设置单元格可编辑/不可编辑，参数 1: row 或由 row 组成的数组，参数 2: dataIndex，参数 3: 状态值(true/false)}
- START_LOADING{Function|开启 table 组件 loading 动画}
- STOP_LOADING{Function|关闭 table 组件 loading 动画}
- CLEAR_EXECUTE_LOG{Function|清空之前对组件的 CURD 操作记录，没有参数}
- SET_DISABLE_SELECT{Function|动态设置行数据的不可选择状态，参数是 row 或由 row 组成的数组}
- GET_UPDATE_ROWS{Function|可编辑单元格值改变所对应的行，没有参数，返回值是数据行组成的数组}
- GET_INSERT_ROWS{Function|记录新增的行，没有参数，返回值是数据行组成的数组}
- GET_DELETE_ROWS{Function|记录移除的行，没有参数，返回值是被移除数据行组成的数组}
- GET_REQUIRED_ERROR{Function|记录可编辑单元格的非空校验，用于保存提示}
- GET_FORMAT_ERROR{Function|记录可编辑单元格的格式校验，用于保存提示}
- GET_SEARCH_HELPER_ERROR{Function|记录搜索帮助的非法操作，用于保存提示}
