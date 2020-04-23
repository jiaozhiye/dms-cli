/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-24 00:04:16
 */
import Vue from 'vue';
import router from '@/routes';
import store from '@/store';
import '@/filters';
import '@/routes/permission';
import '@/config/use';

import App from './app';

// 关闭生产环境的提示
Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
