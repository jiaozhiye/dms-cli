<template>
  <div style="padding: 10px 100px 0;">
    <VirtualTable :columns="columns" :dataSource="list" rowKey="id" height="400" :rowSelection="selection" @change="changeHandle" @columnsChange="columnsChange" />
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
    hobby: '游泳, 篮球',
    email: 'xxx@qq.com',
    address: '长春'
  };
}

export default {
  name: '',
  components: { VirtualTable },
  data() {
    return {
      list: data,
      columns: [
        {
          title: '序号',
          dataIndex: 'id',
          width: 80,
          fixed: 'left'
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
              }
            },
            {
              title: '年龄',
              dataIndex: 'person.age',
              width: 200,
              filter: {
                type: 'checkbox',
                items: [
                  { text: '少年', value: 18 },
                  { text: '青年', value: 20 }
                ]
              }
            },
            {
              title: '性别',
              dataIndex: 'person.sex',
              width: 200,
              align: 'right'
            }
          ]
        },
        {
          title: '图书数量',
          dataIndex: 'books',
          sorter: true,
          width: 200,
          filter: {
            type: 'range-number'
          },
          summation: {
            unit: '个'
          }
        },
        {
          title: '爱好',
          dataIndex: 'hobby'
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          width: 300
        },
        {
          title: '地址',
          dataIndex: 'address',
          fixed: 'right'
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
    columnsChange(list) {
      console.log(111, list);
      this.columns = list;
    }
  }
};
</script>
