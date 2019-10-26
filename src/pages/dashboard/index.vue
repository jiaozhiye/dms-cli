<template>
  <div class="dashboard">
    <div class="left">
      <employePanel />
      <TabChartPanel />
      <StatisPanel />
    </div>
    <div class="right">
      <NoticePanel />
      <ChartPanel1 />
      <ChartPanel2 />
    </div>
  </div>
</template>

<script>
import employePanel from './employePanel';
import TabChartPanel from './tabChartPanel';
import NoticePanel from './noticePanel';
import ChartPanel1 from './chartPanel1';
import ChartPanel2 from './chartPanel2';
import StatisPanel from './statisPanel';

export default {
  name: 'Dashboard',
  components: {
    employePanel,
    TabChartPanel,
    NoticePanel,
    ChartPanel1,
    ChartPanel2,
    StatisPanel
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
  padding: 5px 0 15px;
  .left {
    width: 67%;
    margin-right: 15px;
  }
  .right {
    flex: 1;
  }
}
</style>
