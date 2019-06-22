import Vue from 'vue';
import moment from 'moment';
// 去除 moment.js 多余的语言包
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

Vue.filter('NumberFormat', value => {
  if (!value) return '0';
  // 将整数部分逢三一断
  const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  return intPartFormat;
});

Vue.filter('moment', (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(dataStr).format(pattern);
});
