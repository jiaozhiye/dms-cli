<template>
  <div>
    <Spin :spinning="loading">
      <div ref="chart" class="chartWrap" :style="containerStyle" />
    </Spin>
  </div>
</template>

<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-29 17:15:28
 */
import echarts from 'echarts';
import Resize from '../_utils/resize-mixin';
import { sleep } from '@/utils';
import config from '@/config';
// eharts  配置
const chartConf = config.charts;

export default {
  name: 'Chart1',
  mixins: [Resize],
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
    this.chartRef = null;
    return {
      loading: false
    };
  },
  computed: {
    $chart() {
      return this.$refs.chart;
    }
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
    if (this.chartRef) {
      this.chartRef.dispose();
    }
    this.chartRef = null;
  },
  methods: {
    async initial() {
      this.loading = true;
      // if (process.env.MOCK_DATA) {
      if (1) {
        await sleep(500);
        const { chart1 } = require('@/mock/chartData').default;
        this.draw(chart1);
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
      this.chartRef = echarts.init(this.$chart);
      const option = {
        color: ['#2b9df7'],
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
        grid: {
          top: '10%',
          left: '2%',
          right: '2%',
          bottom: '2%',
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
            name: '单位：辆',
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
            name: '电耗',
            type: 'bar',
            barWidth: '36%',
            data: values
          }
        ]
      };
      if (option && this.chartRef) {
        this.chartRef.clear();
        this.chartRef.setOption(option, true);
      }
      this.bindResizeEvent();
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
