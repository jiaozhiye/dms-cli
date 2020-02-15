<template>
  <div class="wrapper">
    <div class="topper">
      <span class="title">统计报表</span>
    </div>
    <div style="margin-top: -1px">
      <FilterTable
        ref="table"
        :height="214"
        :columns="columns"
        :data-source="list"
        :is-select-column="false"
        :is-pagination="false"
        :is-toper-info="false"
        :is-column-filter="false"
        :is-export-excel="false"
        :on-columns-change="columns => (this.columns = columns)"
      />
    </div>
  </div>
</template>

<script>
import res from '@/mock/tableData';

export default {
  name: '',
  data() {
    return {
      list: [...res.data.items],
      columns: this.createTableColumns()
    };
  },
  methods: {
    createTableColumns() {
      return [
        {
          title: '序号',
          dataIndex: 'index',
          width: 70,
          sorter: true,
          render: props => {
            return <span>{props.row.index + 1}</span>;
          }
        },
        {
          title: '日期',
          dataIndex: 'date',
          width: 150,
          dateFormat: 'yyyy-MM-dd'
        },
        {
          title: '姓名',
          dataIndex: 'person.name',
          width: 120
        },
        {
          title: '价格',
          dataIndex: 'price',
          width: 120,
          precision: 2,
          numberFormat: true
        },
        {
          title: '数量',
          dataIndex: 'num',
          width: 120,
          precision: 0
        },
        {
          title: '总价',
          dataIndex: 'total',
          precision: 2,
          summation: true,
          summationUnit: '元',
          render: props => {
            // 计算规则
            props.row.total = props.row.price * props.row.num;
            return <div>{props.row.total}</div>;
          }
        }
      ];
    }
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  width: 100%;
  height: 260px;
  margin-top: 15px;
  background-color: #fff;
  border-radius: @borderRadius;
  box-shadow: @boxShadow;
  overflow: hidden;
  .topper {
    display: flex;
    height: 46px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid @borderColor;
    .title {
      padding-left: 15px;
    }
  }
}
</style>
