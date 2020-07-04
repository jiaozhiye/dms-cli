/*
 * @Author: 焦质晔
 * @Date: 2020-04-30 14:59:03
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-25 08:13:18
 */
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import elementEnLocale from 'element-ui/lib/locale/lang/en'; // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'; // element-ui lang
import vDesignEnLocale from '../components/locale/lang/en';
import vDesignZhLocale from '../components/locale/lang/zh';
import enLocale from './en';
import zhLocale from './zh';

Vue.use(VueI18n);

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale,
    ...vDesignEnLocale
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale,
    ...vDesignZhLocale
  }
};

const i18n = new VueI18n({
  // set locale  zh | en
  locale: localStorage.getItem('lang') || 'zh',
  // set locale messages
  messages
});

export default i18n;
