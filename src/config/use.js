/**
 * @Author: 焦质晔
 * @Date: 2019/6/20
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 15:45:00
 */
import Vue from 'vue';
import config from '@/assets/js/config';
import ElementUI from 'element-ui';

if (config.env === 'development') {
  require('element-ui/lib/theme-chalk/index.css');
} else {
  // 自定义主题
  require('@/assets/css/element-variables.scss');
}

// 全局设置 ElementUI
Vue.use(ElementUI, { size: 'small', zIndex: 1000 });

// 全局挂载组件
import SvgIcon from '@/components/SvgIcon';
Vue.use(SvgIcon);

import TopFilter from '@/components/TopFilter';
Vue.use(TopFilter);

import FormPanel from '@/components/FormPanel';
Vue.use(FormPanel);

import FilterTable from '@/components/BaseTable';
Vue.use(FilterTable);

import Drawer from '@/components/Drawer';
Vue.use(Drawer);

import BaseDialog from '@/components/BaseDialog';
Vue.use(BaseDialog);

import LazyLoadTab from '@/components/LazyLoadTab';
Vue.use(LazyLoadTab);

import BasePrint from '@/components/BasePrint';
Vue.use(BasePrint);

import ButtonArea from '@/components/ButtonArea';
Vue.use(ButtonArea);

import AjaxButton from '@/components/AjaxButton';
Vue.use(AjaxButton);

import BreakSpace from '@/components/BreakSpace';
Vue.use(BreakSpace);

import Spin from '@/components/Spin';
Vue.use(Spin);

import Anchor from '@/components/Anchor';
Vue.use(Anchor);

import Tinymce from '@/components/Tinymce';
Vue.use(Tinymce);
