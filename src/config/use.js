/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-08 17:57:20
 */
import Vue from 'vue';
import ElementUI from 'element-ui';
import vDesign from '@/components';
import config from '@/config';
import i18n from '@/lang';

// 自定义主题
import '@/assets/css/element-variables.scss';

const APP_ENV = (function(env) {
  if (env === 'development') {
    // ...
  } else {
    console.log = console.warn = console.info = () => {};
  }
  return { env };
})(process.env.NODE_ENV);

// 全局挂载 ElementUI
Vue.use(ElementUI, {
  size: config.toElementSize[localStorage.getItem('size') || config.size],
  zIndex: 1000,
  i18n: (key, value) => i18n.t(key, value)
});

// 全局挂载自定义组件
Vue.use(vDesign, {
  size: localStorage.getItem('size') || config.size,
  i18n: (key, value) => i18n.t(key, value),
  config: config.vDesign
});
