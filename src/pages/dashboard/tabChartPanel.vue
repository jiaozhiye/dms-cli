<template>
  <div class="wrapper">
    <SuperTabs :initial-value="defaultTabLabel" size="large" animated>
      <div slot="extraContent">
        <el-radio-group v-model="fetchParams.radioValue" size="small" @change="changeHandle">
          <el-radio-button label="1001">今日</el-radio-button>
          <el-radio-button label="1002">本周</el-radio-button>
          <el-radio-button label="1003">本月</el-radio-button>
          <el-radio-button label="1004">本年</el-radio-button>
        </el-radio-group>
      </div>
      <tab-panel label="成交量">
        <Chart1 :fetchapi="() => {}" :params="fetchParams" :container-style="{ height: '345px' }" />
      </tab-panel>
      <tab-panel label="同比增长">
        <Chart2 :fetchapi="() => {}" :params="fetchParams" :container-style="{ height: '345px' }" />
      </tab-panel>
    </SuperTabs>
  </div>
</template>

<script>
import Chart1 from '@/charts/dashboard/chart1';
import Chart2 from '@/charts/dashboard/chart2';

export default {
  components: {
    Chart1,
    Chart2
  },
  data() {
    return {
      fetchParams: {
        radioValue: '1001'
      },
      defaultTabLabel: '成交量'
    };
  },
  methods: {
    changeHandle(val) {
      this.fetchParams = { radioValue: val };
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
