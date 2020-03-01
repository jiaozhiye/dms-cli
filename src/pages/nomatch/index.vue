<template>
  <div style="padding: 20px 100px 0;">
    <VirtualTable :columns="columns" :dataSource="list" uidkey="id" height="500" />
  </div>
</template>

<script>
import { VirtualTable } from '@/components/VirtualTable';
// import res from '@/mock/tableData';

const data = [];
for (let i = 0; i < 200; i++) {
  data[i] = {
    id: i + 1,
    name: '小明',
    age: 20,
    num: 1,
    hobby: '游泳',
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
              dataIndex: 'name',
              width: 200
            },
            {
              title: '年龄',
              dataIndex: 'age',
              width: 200
            }
          ]
        },
        {
          title: '数量',
          dataIndex: 'num',
          summation: {
            unit: '个'
          }
        },
        {
          title: '爱好',
          dataIndex: 'hobby',
          width: 500
        },
        {
          title: '地址',
          dataIndex: 'address',
          width: 500
        }
      ]
    };
  }
};
</script>
