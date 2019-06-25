/**
 * @Author: jzy
 * @Date: 2018/1/19
 * @Last Modified by:   jzy
 * @Last Modified time: 2018-08-31 15:45:09
 */
import Vue from 'vue';
import App from './App.vue';
import router from '@/routes';
import store from '@/store';
import '@/filters';
import '@/routes/permission';
import '@/config/use';

import SvgIcon from '@/components/SvgIcon';
Vue.use(SvgIcon);

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
