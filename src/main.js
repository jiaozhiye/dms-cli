/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-11-12 13:29:22
 */
import Vue from 'vue';
import App from './App.vue';
import router from '@/routes';
import store from '@/store';
import '@/filters';
import '@/routes/permission';
import '@/config/use';

// 关闭生产环境的提示
Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});

if (module.hot) {
  module.hot.accept();
}
