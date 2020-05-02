<template>
  <div class="wrapper">
    <div class="topper">
      <span class="title">统计报表</span>
    </div>
    <div style="margin-top: -11px">
      <VirtualTable
        :height="214"
        :columns="columns"
        :dataSource="list"
        :rowKey="record => record.id"
        :showAlert="false"
        :showFullScreen="false"
        :showColumnDefine="false"
        :columnsChange="columns => (this.columns = columns)"
      />
    </div>
  </div>
</template>

<script>
import { language } from '@/mixins/langMixin';

import res from '@/mock/tableData';

export default {
  mixins: [language],
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
          width: 80,
          sorter: true,
          render: text => {
            return text + 1;
          }
        },
        {
          title: '日期',
          dataIndex: 'date',
          width: 200
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
          formatType: 'finance'
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
          summation: {
            unit: '元'
          },
          render: (text, row) => {
            row.total = row.price * row.num;
            return <span>{row.total}</span>;
          }
        }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 260px;
  margin-top: 15px;
  background-color: #fff;
  border-radius: $borderRadius;
  box-shadow: $boxShadow;
  overflow: hidden;
  .topper {
    display: flex;
    height: 46px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid $borderColor;
    .title {
      padding-left: 15px;
    }
  }
}
</style>
