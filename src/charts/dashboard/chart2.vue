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
        color: ['#2b9df7', '#42cb78'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: chartConf.barBgColor
            }
          },
          backgroundColor: chartConf.bgColor,
          extraCssText: `box-shadow: ${chartConf.boxShadow}`,
          textStyle: {
            color: chartConf.textColor,
            fontSize: chartConf.textSize
          }
        },
        legend: {
          orient: 'horizontal',
          y: 'bottom',
          data: ['邮件营销', '联盟广告'],
          textStyle: {
            color: 'rgba(0, 0, 0, 0.65)',
            fontSize: chartConf.chartXAxisSize
          }
        },
        grid: {
          top: '10%',
          left: '2%',
          right: '2%',
          bottom: '8%',
          containLabel: true // 刻度标签
        },
        xAxis: [
          {
            type: 'category',
            data: names,
            axisTick: {
              alignWithLabel: true // 坐标轴刻度
            },
            nameTextStyle: {
              color: chartConf.textColor,
              fontSize: chartConf.textSize
            },
            axisLabel: {
              color: chartConf.textColor,
              fontSize: chartConf.textSize
            },
            axisLine: {
              lineStyle: {
                color: chartConf.lineColor
              }
            }
          }
        ],
        yAxis: [
          {
            name: 'kW·h/100km',
            type: 'value',
            splitLine: {
              lineStyle: {
                type: 'dotted'
              }
            },
            nameTextStyle: {
              color: chartConf.textColor,
              fontSize: chartConf.textSize
            },
            axisLabel: {
              formatter: '{value}',
              color: chartConf.textColor,
              fontSize: chartConf.textSize
            },
            axisLine: {
              lineStyle: {
                color: chartConf.lineColor
              }
            }
          }
        ],
        series: [
          {
            name: '邮件营销',
            type: 'line',
            data: [120, 132, 101, 134, 90, 230]
          },
          {
            name: '联盟广告',
            type: 'line',
            data: [220, 182, 191, 234, 290, 330]
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
