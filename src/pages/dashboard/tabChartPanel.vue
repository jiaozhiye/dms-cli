<template>
  <div class="wrapper">
    <SuperTabs :initialValue="defaultTab" :tabMenus="tabMenus">
      <div slot="extraContent">
        <el-radio-group v-model="fetchParams.radioValue" size="small" @change="changeHandle">
          <el-radio-button label="1001">今日</el-radio-button>
          <el-radio-button label="1002">本周</el-radio-button>
          <el-radio-button label="1003">本月</el-radio-button>
          <el-radio-button label="1004">本年</el-radio-button>
        </el-radio-group>
      </div>
    </SuperTabs>
  </div>
</template>

<script>
import Chart1 from '@/charts/dashboard/chart1';
import Chart2 from '@/charts/dashboard/chart2';

export default {
  name: '',
  data() {
    return {
      fetchParams: {
        radioValue: '1001'
      },
      defaultTab: '备件出库成本',
      tabMenus: []
    };
  },
  created() {
    this.tabMenus = this.createTabMenus();
  },
  methods: {
    createTabMenus() {
      return [
        {
          title: '备件出库成本',
          component: Chart1,
          params: {
            fetchapi: () => {},
            params: this.fetchParams,
            containerStyle: { height: '345px' }
          }
        },
        {
          title: '出库成本结构',
          component: Chart2,
          params: {
            fetchapi: () => {},
            params: this.fetchParams,
            containerStyle: { height: '345px' }
          }
        }
      ];
    },
    changeHandle(val) {
      this.tabMenus.forEach(x => {
        x.params.params = { ...this.fetchParams };
      });
    }
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  width: 100%;
  height: 410px;
  margin-top: 15px;
  background-color: #fff;
  border-radius: @borderRadius;
  box-shadow: @boxShadow;
}
</style>
