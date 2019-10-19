<template>
  <div>
    <Spin :spinning="loading" tip="Loading...">
      <div ref="chart" :style="containerStyle" />
    </Spin>
  </div>
</template>

<script>
import echarts from 'echarts';
import config from '@/config';
// eharts  配置
const chartsConfig = config.charts.fontsize;

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
      try {
        const res = await this.fetchapi(this.params);
        if (res.resultCode === 200) {
          // 构建表格数据
          const xNames = res.data.map(item => item.name);
          const xValue = res.data.map(item => item.value);
          this.draw(xNames, xValue);
        }
      } catch (e) {}
      this.loading = false;
    },
    draw(xNames, xValue) {
      const myChart = echarts.init(this.$refs.chart);
      const option = {
        color: ['#f68862'],
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
            type: 'category',
            data: xNames,
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              show: true,
              textStyle: {
                fontSize: config.chartXAxisSize
              }
            }
          }
        ],
        yAxis: [
          {
            name: '次数',
            type: 'value',
            nameTextStyle: {
              fontSize: config.chartYAxisSize
            },
            axisLabel: {
              formatter: '{value}',
              textStyle: {
                fontSize: config.chartYAxisSize
              }
            }
          }
        ],
        series: [
          {
            name: '次数',
            type: 'bar',
            barWidth: '30%',
            data: xValue,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top',
                  textStyle: {
                    fontSize: config.chartSeriesSize
                  }
                }
              }
            }
          }
        ]
      };
      if (option && typeof option === 'object') {
        myChart.clear();
        myChart.setOption(option, true);
      }
    }
  },
  mounted() {
    this.initial();
  }
};
</script>

<style lang="less" scoped>
</style>
