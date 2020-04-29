/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-29 16:04:47
 */
const config = {
  systemName: '大众MEP系统',
  prefix: '/api', // ajax 请求前缀
  maxCacheNum: 10, // 路由组件最大缓存数量
  showBreadcrumb: true, // 是否显示面包屑
  notifyDuration: 3000, // 通知消息组件显示时间
  table: {
    pageNum: 1,
    pageSize: 20, // 10, 20, 30, 40, 50
    serverSorter: false,
    serverFilter: false
  },
  charts: {
    // 文字大小
    textSize: 12,
    // 文字颜色
    textColor: 'rgba(0, 0, 0, 0.65)',
    // 悬浮框背景颜色
    bgColor: 'rgba(255, 255, 255, 0.85)',
    // 柱状图/折线图鼠标经过的背景颜色
    barBgColor: 'rgba(0, 0, 0, 0.05)',
    // 盒子外发光效果
    boxShadow: '0 0 4px rgba(0, 0, 0, 0.35)',
    // 坐标轴颜色
    lineColor: 'rgba(0, 0, 0, 0.35)'
  }
};

export default config;
