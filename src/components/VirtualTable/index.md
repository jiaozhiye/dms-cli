## API

### Table

| 参数             | 说明                                      | 类型                                                   | 默认值 |
| ---------------- | ----------------------------------------- | ------------------------------------------------------ | ------ |
| columns          | 表格列的配置，[配置项](#column)，必要参数 | array                                                  | -      |
| columnsChange    | 表格列变化事件，必要参数                  | Function(columns)                                      | -      |
| dataSource       | 数据数组                                  | array                                                  | -      |
| rowKey           | 表格行 key 的取值，可以是字符串或一个函数 | string\|Function(row, index) => string                 | uid    |
| fetch            | 向后台请求数据的接口，[配置项](#fetch)    | object                                                 | -      |
| border           | 是否带有纵向边框                          | boolean                                                | true   |
| height           | 表格的高度，单位 px                       | number \| auto                                         | -      |
| maxHeight        | 表格的最大高度，单位 px                   | number                                                 | -      |
| loading          | 页面是否加载中                            | boolean                                                | false  |
| resizable        | 所有列是否允许拖动列宽调整大小            | boolean                                                | true   |
| size             | 表格尺寸                                  | default \| medium \| small \| mini                     | small  |
| uniqueKey        | 设置表格各种配置信息的本地缓存，不能重复  | string                                                 | -      |
| showHeader       | 是否显示表头                              | boolean                                                | true   |
| ellipsis         | 设置所有内容过长时显示为省略号            | boolean                                                | true   |
| rowStyle         | 给行附加样式                              | object \| Function(row, rowIndex)                      | -      |
| cellStyle        | 给单元格附加样式                          | object \| Function(row, column, rowIndex, columnIndex) | -      |
| spanMethod       | 合并行或列的计算方法                      | Function({row, column, rowIndex, columnIndex})         | -      |
| rowSelection     | 列表项是否可选择，[配置项](#rowSelection) | object                                                 | -      |
| expandable       | 展开行配置项，[配置项](#expandable)       | object                                                 | -      |
| multipleSort     | 是否为多列排序模式                        | boolean                                                | true   |
| webPagination    | 是否为前端内存分页                        | boolean                                                | false  |
| showAlert        | 是否显示表格信息                          | boolean                                                | true   |
| alertPosition    | 表格顶部信息放置的位置                    | top \| bottom                                          | top    |
| topSpaceAlign    | 顶部按钮插槽的对其方式                    | left \| right                                          | right  |
| showFullScreen   | 是否显示全屏按钮                          | boolean                                                | true   |
| showRefresh      | 是否显示刷新按钮                          | boolean                                                | true   |
| exportExcel      | 导出表格数据，[配置项](#exportExcel)      | object                                                 | -      |
| tablePrint       | 表格打印，[配置项](#tablePrint)           | object                                                 | -      |
| showColumnDefine | 是否显示列定义                            | boolean                                                | true   |

### 事件

| 事件名称    | 说明                       | 回调参数                                                                                             |
| ----------- | -------------------------- | ---------------------------------------------------------------------------------------------------- |
| change      | 分页、排序、筛选变化时触发 | Function(pagination, filters, sorter, { currentDataSource: tableData, allDataSource: allTableData }) |
| dataChange  | 表格数据变化时触发         | Function(tableData)                                                                                  |
| rowClick    | 行单击事件                 | Function(row, column, event)                                                                         |
| rowDblclick | 行双击事件                 | Function(row, column, event)                                                                         |

### 方法

| 方法名称         | 说明                                           | 参数                                       | 返回值 |
| ---------------- | ---------------------------------------------- | ------------------------------------------ | ------ |
| CALCULATE_HEIGHT | 计算表格高度                                   | -                                          | -      |
| DO_REFRESH       | 刷新表格数据，同时会清空列选中状态             | -                                          | -      |
| GET_LOG          | 获取操作记录，非空校验、格式校验、数据操作记录 | -                                          | object |
| CLEAR_LOG        | 清空表格操作记录                               | -                                          | -      |
| INSERT_RECORDS   | 插入表格行数据                                 | Function(rows \| row, bottom(默认) \| top) | -      |
| REMOVE_RECORDS   | 移除表格数据                                   | Function(rowKeys \| rows \| row )          | -      |
| FORM_VALIDATE    | 表格中的表单校验                               | -                                          | object |

### column

| 参数         | 说明                                           | 类型                                                              | 默认值 |
| ------------ | ---------------------------------------------- | ----------------------------------------------------------------- | ------ |
| dataIndex    | 数据的 key，支持 `a.b.c` 的路径写法，必要参数  | string                                                            | -      |
| title        | 列头显示文字，必要参数                         | string                                                            | -      |
| width        | 列宽度/最小宽度                                | number                                                            | -      |
| fixed        | 列固定（IE 下无效）                            | left \| right                                                     | -      |
| align        | 设置列的对齐方式                               | left \| center \| right                                           | left   |
| hidden       | 是否隐藏列                                     | boolean                                                           | false  |
| ellipsis     | 超过宽度将自动省略                             | boolean                                                           | false  |
| className    | 列样式类名                                     | string                                                            | -      |
| children     | 内嵌 children，以渲染分组表头                  | array                                                             |        |
| sorter       | 列排序                                         | boolean \| func                                                   | -      |
| filter       | 列筛选，[配置项](#filter)                      | object                                                            | -      |
| precision    | 数值类型字段的精度                             | number                                                            | -      |
| formatType   | 字段的格式化类型，[配置项](#formatType)        | string                                                            | -      |
| required     | 可编辑列是否必填                               | boolean                                                           | false  |
| editRender   | 可编辑单元格，返回值请参考 [配置项](#editable) | Function(row, column):object                                      | -      |
| dictItems    | 数据字典配置，[配置项](#item)                  | array                                                             | -      |
| summation    | 底部合计，[配置项](#summation)                 | object                                                            | -      |
| groupSummary | 分组汇总                                       | boolean                                                           | false  |
| render       | 列渲染方法                                     | Function(text, row, column, rowIndex, cellIndex):JSX Node         | -      |
| extraRender  | 额外的列渲染方法，用于处理导出和打印数据       | Function(text, row, column, rowIndex, cellIndex):string \| number | -      |

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

| 参数     | 说明       |
| -------- | ---------- |
| text     | 文本输入框 |
| checkbox | 复选框     |
| radio    | 单选按钮   |
| number   | 数值输入框 |
| date     | 日期类型   |

### editable

| 参数     | 说明                                          | 类型                            | 默认值 |
| -------- | --------------------------------------------- | ------------------------------- | ------ |
| type     | 可编辑类型，[配置项](#editType)，必要参数     | string                          | -      |
| items    | 下拉框的列表项，[配置项](#item)               | array                           | -      |
| editable | 是否可编辑                                    | boolean                         | -      |
| disabled | 是否禁用编辑功能，且禁止切换                  | boolean                         | -      |
| extra    | 可编辑表单的额外配置项，[配置项](#extra)      | object                          | -      |
| helper   | 可编辑单元格搜索帮助配置项，[配置项](#helper) | object                          | -      |
| rules    | 表单校验规则，数组值请参考[配置项](#rule)     | array                           | -      |
| onInput  | 表单的 input 事件                             | Function(cell, row)             | -      |
| onChange | 表单的 change 事件                            | Function(cell, row)             | -      |
| onEnter  | 表单的 enter 事件                             | Function(cell, row)             | -      |
| onClick  | 搜索帮助的单击事件，只对 search-helper 有效   | Function，[参数列表](#shParams) | -      |

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
| clearable  | 是否显示清除按钮   | boolean          | -      |

### helper

| 参数          | 说明                                                            | 类型                                  | 默认值 |
| ------------- | --------------------------------------------------------------- | ------------------------------------- | ------ |
| filters       | 顶部筛选条件配置，参考 TopFilter 组件，必要参数                 | array                                 | -      |
| table         | 列表组件配置，[配置项](#table)，必要参数                        | array                                 | -      |
| fieldAliasMap | 表单字段与回传数据字段的映射，[配置项](#alias)， 必要参数       | func                                  | -      |
| open          | 打开搜索帮助的前置钩子，返回 bool 类型，true 打开、false 不打开 | Function，[参数列表](#shParams): bool | -      |
| closed        | 关闭搜索帮助的后置钩子，参数是带回的行数据                      | Function(tableData)                   | -      |

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

| 参数            | 说明                 | 类型                                   | 默认值 |
| --------------- | -------------------- | -------------------------------------- | ------ |
| type            | 选择类型，必要参数   | checkbox \| radio                      | -      |
| selectedRowKeys | 选中项的 rowKey 数组 | array                                  | -      |
| disabled        | 是否允许行选择       | Function(row) => boolean               | -      |
| onChange        | 选中项发生变化时触发 | Function(selectionKeys, selectionRows) | -      |

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

1. 在 Table 中，`dataSource` 和 `columns` 里的数据值都需要指定 `key` 值。对于 `dataSource` 默认将每列数据的 `key` 属性作为唯一的标识。

2. 如果你的数据没有这个属性，务必使用 `rowKey` 来指定数据列的主键。若没有指定，控制台会出现缺少 key 的提示，表格组件也会出现各类奇怪的错误。

3. 表格支持树形数据的展示，当数据中有 children 字段时会自动展示为树形表格，渲染形表格时，必须要指定 rowKey 且值不能为 index。

```bash
// 比如你的数据主键是 uid
return <Table rowKey="uid" />;
// 或
return <Table rowKey={record => record.uid} />;
```

`示例代码`

```bash
# template
<template>
  <VirtualTable
    ref="table"
    uniqueKey="jzyDemoTable"
    height="auto"
    :columns="columns"
    :fetch="fetch"
    :rowKey="record => record.id"
    :rowSelection="selection"
    :exportExcel="exportExcel"
    :tablePrint="tablePrint"
    :columnsChange="columns => (this.columns = columns)"
    @dataChange="dataChangeHandle"
  >
    <template slot="default">
      <el-button type="primary" icon="el-icon-plus">新建</el-button>
    </template>
  </VirtualTable>
</template>

# js
export default {
  data() {
    this.selectedKeys = [];
    return {
      columns: this.createTableColumns(),
      fetch: {
        api: () => {},
        params: {},
        dataKey: 'items'
      },
      selection: {
        type: 'checkbox',
        selectedRowKeys: this.selectedKeys,
        disabled: row => {
          return row.id === 3;
        },
        onChange: (val, rows) => {
          this.selectedKeys = val;
        }
      },
      exportExcel: {
        fileName: '导出文件.xlsx'
      },
      tablePrint: {
        showLogo: true
      },
    };
  },
  methods: {
    // 创建表格列配置
    createTableColumns() {
      return [
        {
          title: '操作',
          dataIndex: '__action__', // 操作列的 dataIndex 的值不能改
          fixed: 'left',
          width: 100,
          render: () => {
            return (
              <div>
                <el-button type="text">编辑</el-button>
                <el-button type="text">查看</el-button>
              </div>
            );
          }
        },
        {
          title: '序号',
          dataIndex: 'index',
          width: 80,
          sorter: true,
          render: text => {
            return text + 1;
          }
        },
        {
          title: '创建时间',
          dataIndex: 'date',
          width: 220,
          sorter: true,
          filter: {
            type: 'date'
          },
          editRender: row => {
            return {
              type: 'datetime'
            };
          }
        },
        {
          title: '姓名',
          dataIndex: 'person.name',
          width: 200,
          required: true,
          sorter: true,
          filter: {
            type: 'text'
          },
          editRender: row => {
            return {
              type: 'search-helper',
              editable: true,
              extra: {
                maxlength: 10,
                disabled: row.id === 3
              },
              rules: [{ required: true, message: '姓名不能为空' }],
              onClick: (cell, row, column, cb, ev) => {
                this.tableShProps = { row, dataIndex: column.dataIndex, callback: cb };
                this.visible_table = true;
              }
            };
          }
        },
        {
          title: '性别',
          dataIndex: 'person.sex',
          width: 100,
          dictItems: [
            { text: '男', value: '1' },
            { text: '女', value: '0' }
          ]
        },
        {
          title: '年龄',
          dataIndex: 'person.age',
          width: 100,
          sorter: true,
          filter: {
            type: 'number'
          }
        },
        {
          title: '价格',
          dataIndex: 'price',
          width: 150,
          precision: 2,
          required: true,
          sorter: true,
          filter: {
            type: 'number'
          },
          editRender: row => {
            return {
              type: 'number',
              extra: {
                max: 1000
              },
              rules: [{ required: true, message: '价格不能为空' }]
            };
          }
        },
        {
          title: '数量',
          dataIndex: 'num',
          width: 150,
          required: true,
          sorter: true,
          filter: {
            type: 'number'
          },
          editRender: row => {
            return {
              type: 'number',
              extra: {
                max: 1000
              },
              rules: [{ required: true, message: '数量不能为空' }]
            };
          }
        },
        {
          title: '总价',
          dataIndex: 'total',
          width: 150,
          precision: 2,
          align: 'right',
          sorter: true,
          filter: {
            type: 'number'
          },
          summation: {
            unit: '元'
          },
          render: (text, row) => {
            row.total = row.price * row.num;
            return <span>{row.total.toFixed(2)}</span>;
          },
          extraRender: (text, row) => {
            return Number(row.price * row.num).toFixed(2);
          }
        },
        {
          title: '是否选择',
          dataIndex: 'choice',
          align: 'center',
          width: 150,
          editRender: row => {
            return {
              type: 'checkbox',
              editable: true,
              extra: {
                trueValue: 1,
                falseValue: 0,
                disabled: true
              }
            };
          },
          dictItems: [
            { text: '选中', value: 1 },
            { text: '非选中', value: 0 }
          ]
        },
        {
          title: '状态',
          dataIndex: 'state',
          width: 150,
          filter: {
            type: 'checkbox',
            items: [
              { text: '已完成', value: 1 },
              { text: '进行中', value: 2 },
              { text: '未完成', value: 3 }
            ]
          },
          editRender: row => {
            return {
              type: 'select',
              items: [
                { text: '已完成', value: 1 },
                { text: '进行中', value: 2 },
                { text: '未完成', value: 3 }
              ]
            };
          },
          dictItems: [
            { text: '已完成', value: 1 },
            { text: '进行中', value: 2 },
            { text: '未完成', value: 3 }
          ]
        },
        {
          title: '业余爱好',
          dataIndex: 'hobby',
          width: 150,
          filter: {
            type: 'checkbox',
            items: [
              { text: '篮球', value: 1 },
              { text: '足球', value: 2 },
              { text: '乒乓球', value: 3 },
              { text: '游泳', value: 4 }
            ]
          },
          editRender: row => {
            return {
              type: 'select-multiple',
              items: [
                { text: '篮球', value: 1 },
                { text: '足球', value: 2 },
                { text: '乒乓球', value: 3 },
                { text: '游泳', value: 4 }
              ]
            };
          },
          dictItems: [
            { text: '篮球', value: 1 },
            { text: '足球', value: 2 },
            { text: '乒乓球', value: 3 },
            { text: '游泳', value: 4 }
          ]
        },
        {
          title: '地址',
          dataIndex: 'address',
          width: 300
        }
      ];
    },
    dataChangeHandle(tableData) {
      // ...
    }
  }
};
```
