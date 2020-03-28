<template>
  <div style="padding: 10px 100px 0;">
    <!-- <el-button @click="clickHandle">按钮</el-button> -->
    <VirtualTable :columns="columns" :dataSource="list" rowKey="id" :height="height" :rowSelection="selection" :columnsChange="columnsChange" @change="changeHandle">
      <span></span>
    </VirtualTable>
  </div>
</template>

<script>
import { VirtualTable } from '@/components/VirtualTable';
// import res from '@/mock/tableData';

const data = [];
for (let i = 0; i < 330; i++) {
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
  name: '',
  components: { VirtualTable },
  data() {
    return {
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
          sorter: true,
          filter: {
            type: 'range-number'
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
        type: 'radio',
        selectedRowKeys: [2, 3],
        onChange: val => {
          // console.log(222, val);
        }
      }
    };
  },
  methods: {
    changeHandle(pagination, filters, sorter, { currentDataSource }) {
      // console.log(pagination, filters, sorter, currentDataSource);
    },
    columnsChange(columns) {
      this.columns = columns;
    },
    clickHandle() {
      this.fetch.params = { a: 7 };
    }
  }
};
</script>
