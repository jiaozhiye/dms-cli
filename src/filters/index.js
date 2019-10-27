/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 10:00:00
 */
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

Vue.filter('DateFormat', (input, pattern = 'YYYY-MM-DD') => {
  return moment(input).format(pattern);
});

Vue.filter('DateTimeFormat', (input, pattern = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(input).format(pattern);
});
