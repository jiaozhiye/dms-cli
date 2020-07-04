<template>
  <div class="dashboard">
    <header class="header">
      <el-row :gutter="15">
        <el-col :span="6">
          <ChartCard>
            <span slot="title">总销售额</span>
            <span slot="title_desc">指标说明</span>
            <span slot="total">￥<CountUp :end-val="126560"/></span>
            <div>
              <Trend flag="up" style="margin-right: 10px;">
                <span slot="term">周同比</span>
                12%
              </Trend>
              <Trend flag="down">
                <span slot="term">日同比</span>
                11%
              </Trend>
            </div>
            <div slot="footer">日均销售额 <span>￥12,423</span></div>
          </ChartCard>
        </el-col>
        <el-col :span="6">
          <ChartCard>
            <span slot="title">访问量</span>
            <span slot="title_desc">指标说明</span>
            <span slot="total"><CountUp :end-val="8846"/></span>
            <div>
              <MiniChart1 :fetchapi="() => {}" :params="{}" :container-style="{ height: '46px' }" />
            </div>
            <div slot="footer">日访问量 <span>1,234</span></div>
          </ChartCard>
        </el-col>
        <el-col :span="6">
          <ChartCard>
            <span slot="title">支付笔数</span>
            <span slot="title_desc">指标说明</span>
            <span slot="total"><CountUp :end-val="6560"/></span>
            <div>
              <MiniChart2 :fetchapi="() => {}" :params="{}" :container-style="{ height: '46px' }" />
            </div>
            <div slot="footer">转化率 <span>62%</span></div>
          </ChartCard>
        </el-col>
        <el-col :span="6">
          <ChartCard>
            <span slot="title">运营活动效果</span>
            <span slot="title_desc">指标说明</span>
            <span slot="total"><CountUp :end-val="78" />%</span>
            <div>
              <mini-progress color="rgb(19, 194, 194)" :target="80" :percentage="78" height="10px" />
            </div>
            <div slot="footer">
              <Trend flag="down" style="margin-right: 10px;">
                <span slot="term">同周比</span>
                12%
              </Trend>
              <Trend flag="up">
                <span slot="term">日环比</span>
                80%
              </Trend>
            </div>
          </ChartCard>
        </el-col>
      </el-row>
    </header>
    <section class="main">
      <div class="left">
        <EmployePanel />
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
import ChartCard from './ChartCard';
import Trend from './Trend';
import EmployePanel from './employePanel';
import TabChartPanel from './tabChartPanel';
import NoticePanel from './noticePanel';
import ChartPanel1 from './chartPanel1';
import ChartPanel2 from './chartPanel2';
import StatisPanel from './statisPanel';
import FooterPanel from './footerPanel';

import MiniChart1 from '@/charts/dashboard/mini/lineChart';
import MiniChart2 from '@/charts/dashboard/mini/barChart';
import MiniProgress from './MiniProgress';

export default {
  name: 'Dashboard',
  components: {
    ChartCard,
    Trend,
    EmployePanel,
    TabChartPanel,
    NoticePanel,
    ChartPanel1,
    ChartPanel2,
    StatisPanel,
    FooterPanel,
    MiniChart1,
    MiniChart2,
    MiniProgress
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  .header {
    margin-bottom: 15px;
  }
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
    padding: 15px 0;
  }
}
</style>
