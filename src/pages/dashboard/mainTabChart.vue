<template>
  <div class="wrapper">
    <SuperTabs :initialValue="defaultTab" :tabMenus="tabMenus">
      <div slot="extraContent">
        <el-radio-group v-model="radioValue" size="small">
          <el-radio-button label="今日"></el-radio-button>
          <el-radio-button label="本周"></el-radio-button>
          <el-radio-button label="本月"></el-radio-button>
          <el-radio-button label="本年"></el-radio-button>
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
      radioValue: '今日',
      defaultTab: '备件出库成本',
      tabMenus: [
        {
          title: '备件出库成本',
          component: Chart1,
          params: {
            fetchapi: () => {},
            params: {},
            containerStyle: { height: '345px' }
          },
          on: {}
        },
        {
          title: '出库成本结构',
          component: Chart2,
          params: {
            fetchapi: () => {},
            params: {},
            containerStyle: { height: '345px' }
          },
          on: {}
        }
      ]
    };
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
