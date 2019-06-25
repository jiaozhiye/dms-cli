/**
 * @Author: 焦质晔
 * @Date: 2019/6/20
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 15:45:00
 */
import Vue from 'vue';
import App from './App.vue';
import router from '@/routes';
import store from '@/store';
import '@/filters';
import '@/routes/permission';
import '@/config/use';

// 全局挂载 SvgIcon 组件
import SvgIcon from '@/components/SvgIcon';
Vue.use(SvgIcon);

import FilterTable from '@/components/BaseTable';
Vue.use(FilterTable);

import LazyLoadTab from '@/components/LazyLoadTab';
Vue.use(LazyLoadTab);

import Drawer from '@/components/Drawer';
Vue.use(Drawer);

import BaseDialog from '@/components/BaseDialog';
Vue.use(BaseDialog);

import TopFilter from '@/components/TopFilter';
Vue.use(TopFilter);

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
