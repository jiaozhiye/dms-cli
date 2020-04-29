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
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-29 16:52:08
 */
import echarts from 'echarts';
import { sleep } from '@/utils';
import config from '@/config';
// eharts  配置
const chartConf = config.charts;

export default {
  name: 'Chart4',
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
  mounted() {
    this.initial();
  },
  destroyed() {
    if (this.myChart) {
      this.myChart.dispose();
    }
    this.myChart = null;
  },
  methods: {
    async initial() {
      this.loading = true;
      if (process.env.MOCK_DATA) {
        await sleep(500);
        const { chart4 } = require('@/mock/chartData').default;
        this.draw(chart4);
      } else {
        try {
          const res = await this.fetchapi(this.params);
          if (res.code === 200) {
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
          formatter: '{a} <br/>{b}: {c}%',
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
          data: values.map(x => x.name),
          textStyle: {
            color: chartConf.textColor,
            fontSize: chartConf.chartXAxisSize
          }
        },
        series: [
          {
            name: '漏斗图',
            type: 'funnel',
            left: '5%', // 绘制位置
            top: '10%',
            bottom: '10%',
            width: '60%',
            data: values
          }
        ]
      };
      if (option && this.myChart) {
        this.myChart.clear();
        this.myChart.setOption(option, true);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.chartWrap {
  width: 100%;
  min-height: 300px;
}
</style>
