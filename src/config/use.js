/**
 * @Author: 焦质晔
 * @Date: 2019/6/20
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 15:45:00
 */
import Vue from 'vue';
import config from '@/assets/js/config';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 自定义主题
import '@/assets/css/element-variables.scss';

// 全局设置 ElementUI
Vue.use(ElementUI, { size: 'small', zIndex: 1000 });

// 全局挂载组件
import SvgIcon from '@/components/SvgIcon';
Vue.use(SvgIcon);

import TopFilter from '@/components/TopFilter';
Vue.use(TopFilter);

import FilterTable from '@/components/BaseTable';
Vue.use(FilterTable);
