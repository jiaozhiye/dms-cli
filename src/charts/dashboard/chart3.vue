<template>
  <div>
    <Spin :spinning="loading" tip="Loading...">
      <div ref="chart" class="chartWrap" :style="containerStyle" />
    </Spin>
  </div>
</template>

<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 10:00:00
 */
import echarts from 'echarts';
import { sleep } from '@/utils';
import config from '@/config';
// eharts  配置
const chartConf = config.charts;

export default {
  name: '',
  props: {
    fetchapi: {
      type: Function,
      required: true
    },
    params: {
      type: Object,
      default: () => ({})
    },
    containerStyle: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    // echart 实例
    this.myChart = null;
    return {
      loading: false
    };
  },
  watch: {
    params() {
      this.initial();
    }
  },
  methods: {
    async initial() {
      this.loading = true;
      if (process.env.MOCK_DATA === 'true') {
        await sleep(500);
        const { chart1 } = require('@/mock/chartData').default;
        this.draw(chart1);
      } else {
        try {
          const res = await this.fetchapi(this.params);
          if (res.resultCode === 200) {
            this.draw(res.data);
          }
        } catch (e) {}
      }
      this.loading = false;
    },
    draw({ names, values }) {
      this.myChart = echarts.init(this.$refs.chart);
      const option = {
        color: ['#2fa1fb', '#9c61e2', '#42cb78', '#ffd559', '#fc667e'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
          axisPointer: {
            type: 'shadow'
          },
          backgroundColor: chartConf.bgColor,
          extraCssText: `box-shadow: ${chartConf.boxShadow}`,
          textStyle: {
            color: chartConf.textColor,
            fontSize: chartConf.chartXAxisSize
          }
        },
        legend: {
          orient: 'vertical',
          x: 'right',
          y: 'center',
          padding: [0, 10, 0, 0],
          data: ['邮件营销', '联盟广告', '视频广告', '其他'],
          textStyle: {
            color: chartConf.textColor,
            fontSize: chartConf.chartXAxisSize
          }
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            center: ['38%', '52%'], // 改变饼状图位置
            radius: ['30%', '60%'],
            data: [{ value: 135, name: '邮件营销' }, { value: 1048, name: '联盟广告' }, { value: 251, name: '视频广告' }, { value: 102, name: '其他' }]
          }
        ]
      };
      if (option && this.myChart) {
        this.myChart.clear();
        this.myChart.setOption(option, true);
      }
    }
  },
  mounted() {
    this.initial();
  },
  beforeDestroy() {
    if (this.myChart) {
      this.myChart.dispose();
    }
    this.myChart = null;
  }
};
</script>

<style lang="less" scoped>
.chartWrap {
  width: 100%;
  min-height: 300px;
}
</style>
