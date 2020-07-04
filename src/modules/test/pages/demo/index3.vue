<template>
  <div>
    <FilterTable
      ref="table1"
      :height="400"
      :columns="columns1"
      :dataSource="list1"
      selectionType="multiple"
      :isMemoryPagination="true"
      :onColumnsChange="columns => (this.columns1 = columns)"
      :onSyncTableData="dataChangeHandle"
    >
      <template slot="controls"></template>
    </FilterTable>
  </div>
</template>

<script>
import tableData from '@/mock/tableData';

export default {
  name: 'Demo3',
  data() {
    return {
      list1: tableData.data.items,
      columns1: this.createTableColumns()
    };
  },
  methods: {
    createTableColumns() {
      return [
        {
          title: '操作',
          dataIndex: 'column-action',
          fixed: 'left',
          width: 100,
          render: (text, row) => {
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
          width: 100,
          sorter: true,
          render: props => {
            return <span>{props.row.index + 1}</span>;
          }
        },
        {
          title: '创建时间',
          dataIndex: 'date',
          width: 200,
          sorter: true,
          filter: true,
          filterType: 'date-range',
          editable: true,
          editType: 'date-picker'
        },
        {
          title: '姓名',
          dataIndex: 'person.name',
          width: 200,
          sorter: true,
          filter: true,
          filterType: 'input',
          editable: true,
          editType: 'text'
        },
        {
          title: '性别',
          dataIndex: 'person.sex',
          width: 100,
          sorter: true,
          dictItems: [
            { text: '男', value: '1' },
            { text: '女', value: '0' }
          ]
        },
        {
          title: '年龄',
          dataIndex: 'person.age',
          sorter: true,
          width: 200
        },
        {
          title: '价格',
          dataIndex: 'price',
          width: 150,
          precision: 2,
          sorter: true,
          filter: true,
          filterType: 'number',
          editable: true,
          editType: 'number'
        },
        {
          title: '数量',
          dataIndex: 'num',
          width: 150,
          sorter: true,
          filter: true,
          filterType: 'number',
          editable: true,
          editType: 'number'
        },
        {
          title: '总价',
          dataIndex: 'total',
          width: 150,
          summation: true,
          summationUnit: '元',
          sorter: true,
          filter: true,
          filterType: 'number',
          render: props => {
            props.row.total = props.row.price * props.row.num;
            return <span>{props.row.total}</span>;
          }
        },
        {
          title: '是否选择',
          dataIndex: 'choice',
          width: 150,
          filter: true,
          filterType: 'radio',
          filterItems: [
            { text: '选中', value: 1 },
            { text: '非选中', value: 0 }
          ],
          editable: true,
          defaultEditable: true,
          editType: 'checkbox',
          editItems: [
            { text: '选中', trueValue: 1 },
            { text: '非选中', falseValue: 0 }
          ],
          dictItems: [
            { text: '选中', value: 1 },
            { text: '非选中', value: 0 }
          ]
        },
        {
          title: '状态',
          dataIndex: 'state',
          width: 150,
          filter: true,
          filterType: 'radio',
          filterItems: [
            { text: '已完成', value: 1 },
            { text: '进行中', value: 2 },
            { text: '未完成', value: 3 }
          ],
          editable: true,
          editType: 'select',
          editItems: [
            { text: '已完成', value: 1 },
            { text: '进行中', value: 2 },
            { text: '未完成', value: 3 }
          ],
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
          filter: true,
          filterType: 'checkbox',
          filterItems: [
            { text: '篮球', value: 1 },
            { text: '足球', value: 2 },
            { text: '乒乓球', value: 3 },
            { text: '游泳', value: 4 }
          ],
          editable: true,
          editType: 'select-multiple',
          editItems: [
            { text: '篮球', value: 1 },
            { text: '足球', value: 2 },
            { text: '乒乓球', value: 3 },
            { text: '游泳', value: 4 }
          ],
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
          width: 250
        }
      ];
    },
    dataChangeHandle() {}
  }
};
</script>
