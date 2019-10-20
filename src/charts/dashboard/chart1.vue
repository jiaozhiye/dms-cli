<template>
  <div>
    <Spin :spinning="loading" tip="Loading...">
      <div ref="chart" class="chartWrap" :style="containerStyle" />
    </Spin>
  </div>
</template>

<script>
import echarts from 'echarts';
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
        color: ['#97bfff'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '10%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            // name: '月份',
            type: 'category',
            data: names,
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              show: true,
              textStyle: {
                fontSize: chartConf.chartXAxisSize
              }
            }
          }
        ],
        yAxis: [
          {
            name: 'kW·h/100km',
            type: 'value',
            nameTextStyle: {
              fontSize: chartConf.chartYAxisSize
            },
            axisLabel: {
              formatter: '{value}',
              textStyle: {
                fontSize: chartConf.chartYAxisSize
              }
            }
          }
        ],
        series: [
          {
            name: '电耗',
            type: 'bar',
            barWidth: '30%',
            data: values,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top',
                  textStyle: {
                    fontSize: chartConf.chartSeriesSize
                  }
                }
              }
            }
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
  min-height: 400px;
}
</style>
