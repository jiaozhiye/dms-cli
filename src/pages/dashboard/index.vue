<template>
  <div class="dashboard">
    <div class="left">
      <EmployeInfo />
      <MainTabChart />
    </div>
    <div class="right">
      <NoticePanel />
      <ChartPanel1 />
    </div>
  </div>
</template>

<script>
import EmployeInfo from './employeInfo.vue';
import MainTabChart from './mainTabChart.vue';
import NoticePanel from './noticePanel.vue';
import ChartPanel1 from './chartPanel1.vue';

export default {
  name: 'Dashboard',
  components: {
    EmployeInfo,
    MainTabChart,
    NoticePanel,
    ChartPanel1
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped lang="less">
.dashboard {
  display: flex;
  height: calc(100vh - 100px);
  .left {
    width: 65%;
    margin-right: 15px;
  }
  .right {
    width: 35%;
  }
}
</style>
