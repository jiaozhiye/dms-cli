/**
 * @Author: 焦质晔
 * @Date: 2019/6/20
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 15:45:00
 */
export default {
  systemName: '奥迪EP系统',
  maxCacheNum: 10, // 路由组件最大缓存数量
  notifyDuration: 3000, // 通知消息组件显示时间
  table: {
    pageNum: 1,
    pageSize: 10, // 10, 20, 30, 40
    serverSort: false,
    serverFilter: false
  },
  charts: {
    fontsize: {
      // 图例
      chartLegendSize: 14,
      // 饼状图显示文字
      chartSeriesSize: 14,
      // 柱状图x的
      chartXAxisSize: 14,
      chartYAxisSize: 14,
      // tooltip
      chartTooltipSize: 14
    }
  }
};
