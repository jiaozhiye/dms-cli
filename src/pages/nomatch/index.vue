<template>
  <div style="padding: 10px 100px 0;">
    <VirtualTable :columns="columns" :dataSource="list" uidkey="id" height="400" />
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
    books: 1,
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
          width: 80
        },
        {
          title: '个人信息',
          dataIndex: 'person',
          children: [
            {
              title: '姓名',
              dataIndex: 'person.name',
              width: 200
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
          dataIndex: 'email'
        },
        {
          title: '地址',
          dataIndex: 'address'
        }
      ]
    };
  }
};
</script>
