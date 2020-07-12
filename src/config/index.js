/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-08 17:57:31
 */
import i18n from '@/lang';

const config = {
  systemName: i18n.t('app.title'),
  lang: 'zh', // 语言
  size: 'default', // 尺寸
  prefix: '/api', // ajax 请求前缀
  maxCacheNum: 10, // 路由组件最大缓存数量
  showBreadcrumb: false, // 是否显示面包屑
  showScreenFull: true, // 是否显示全屏按钮
  showCustomTheme: true, // 是否显示自定义主题
  showLangSelect: true, // 是否显示多语言
  showSizeSelect: true, // 是否显示尺寸选择
  showCTICenter: true, // 是否显示 CTI
  showNotification: true, // 是否显示通知
  notifyDuration: 3000, // 通知消息组件显示时间
  // element ui 尺寸的映射
  toElementSize: {
    large: 'medium',
    default: 'small',
    small: 'mini'
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
  },
  // vDesign 组件库的全局配置
  vDesign: {}
};

export default config;
