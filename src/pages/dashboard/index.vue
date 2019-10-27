<template>
  <div class="dashboard">
    <section class="main">
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
    </section>
    <footer class="footer tc">
      <FooterPanel />
    </footer>
  </div>
</template>

<script>
import employePanel from './employePanel';
import TabChartPanel from './tabChartPanel';
import NoticePanel from './noticePanel';
import ChartPanel1 from './chartPanel1';
import ChartPanel2 from './chartPanel2';
import StatisPanel from './statisPanel';
import FooterPanel from './footerPanel';

export default {
  name: 'Dashboard',
  components: {
    employePanel,
    TabChartPanel,
    NoticePanel,
    ChartPanel1,
    ChartPanel2,
    StatisPanel,
    FooterPanel
  },
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
.dashboard {
  padding: 5px 0 0;
  .main {
    display: flex;
    .left {
      width: 67%;
      margin-right: 15px;
    }
    .right {
      flex: 1;
      width: 0;
    }
  }
  .footer {
    height: 30px;
    line-height: 30px;
    padding: 15px 0;
  }
}
</style>
