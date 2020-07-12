<template>
  <div>
    <el-button @click="clickHandle">按钮</el-button>
    <div v-if="visible">
      <VirtualTable
        ref="table"
        uniqueKey="jzyDemoTable2"
        :exportExcel="{
          fileName: 'aaa.xlsx'
        }"
        :tablePrint="{
          showLogo: true
        }"
        :columns="columns"
        :dataSource="list"
        rowKey="id"
        maxHeight="400"
        :webPagination="true"
        :expandable="expandable"
        :columnsChange="columnsChange"
        @dataChange="changeHandle"
      >
        <span></span>
      </VirtualTable>
    </div>
  </div>
</template>

<script>
const data = [];
for (let i = 0; i < 210; i++) {
  data[i] = {
    id: i + 1,
    person: {
      name: '小明',
      age: 20,
      sex: '男'
    },
    books: i >= 50 ? 50 : i + 1,
    state: 1,
    hobby: [1, 2],
    email: 'xxx@qq.com',
    address: '长春',
    date: '2012-12-12 12:12:12'
  };
}

export default {
  name: 'Demo2',
  data() {
    return {
      visible: true,
      list: data,
      height: 400,
      fetch: {
        api: () => {},
        params: {},
        dataKey: 'items'
      },
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          width: 100,
          fixed: 'left',
          sorter: true,
          render: text => {
            return text + 1;
          }
        },
        {
          title: '创建时间',
          dataIndex: 'date',
          width: 200,
          editRender: row => {
            return {
              type: 'datetime',
              editable: false,
              extra: {}
            };
          }
        },
        {
          title: '个人信息',
          dataIndex: 'person',
          children: [
            {
              title: '姓名',
              dataIndex: 'person.name',
              width: 200,
              filter: {
                type: 'text'
              },
              editRender: row => {
                return {
                  type: 'text',
                  editable: false,
                  disabled: row.index === 2,
                  extra: {
                    maxlength: 10
                  },
                  rules: [{ required: true, message: '姓名不能为空' }]
                };
              }
            },
            {
              title: '年龄',
              dataIndex: 'person.age',
              width: 200
            },
            {
              title: '性别',
              dataIndex: 'person.sex',
              width: 200
            }
          ]
        },
        {
          title: '图书数量',
          dataIndex: 'books',
          width: 200,
          sorter: true,
          groupSummary: true,
          filter: {
            type: 'number'
          },
          editRender: row => {
            return {
              type: 'number',
              editable: false
            };
          },
          summation: {
            unit: '个'
          }
        },
        {
          title: '状态',
          dataIndex: 'state',
          width: 200,
          editRender: row => {
            return {
              type: 'checkbox',
              editable: false,
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
          title: '爱好',
          dataIndex: 'hobby',
          width: 200,
          filter: {
            type: 'checkbox',
            items: [
              { text: '篮球', value: 1 },
              { text: '足球', value: 2 }
            ]
          },
          editRender: row => {
            return {
              type: 'select-multiple',
              editable: false,
              items: [
                { text: '篮球', value: 1 },
                { text: '足球', value: 2 }
              ],
              extra: {}
            };
          },
          dictItems: [
            { text: '篮球', value: 1 },
            { text: '足球', value: 2 }
          ]
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          width: 200
        },
        {
          title: '地址',
          dataIndex: 'address',
          fixed: 'right',
          width: 200
        }
      ],
      selection: {
        type: 'checkbox',
        selectedRowKeys: [1, 2],
        disabled: row => {
          return row.id === 3;
        },
        onChange: val => {
          // console.log(222, val);
        }
      },
      expandable: {
        // defaultExpandAllRows: true,
        expandedRowRender: () => {
          return <span>asdasd</span>;
        },
        onChange: val => {
          // console.log(val);
        }
      }
    };
  },
  computed: {
    $table() {
      return this.$refs[`table`];
    }
  },
  methods: {
    changeHandle() {
      // console.log(111);
    },
    columnsChange(columns) {
      this.columns = columns;
    },
    clickHandle() {
      // this.list.push({ id: Math.random(), books: 10 });
      // this.list.splice(0, 1);
      // this.selection.selectedRowKeys = [4];
      // console.log(this.$refs.table.GET_LOG());
      // this.visible = !this.visible;
      // this.$table.INSERT_RECORDS({ id: Math.random(), books: 10 });
    }
  }
};
</script>
