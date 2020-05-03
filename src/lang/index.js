/*
 * @Author: 焦质晔
 * @Date: 2020-04-30 14:59:03
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-03 20:07:14
 */
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import elementEnLocale from 'element-ui/lib/locale/lang/en'; // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'; // element-ui lang
import vTableEnLocale from '@/components/VirtualTable/packages/lang/en'; // VirtualTable lang
import vTableZhLocale from '@/components/VirtualTable/packages/lang/zh'; // VirtualTable lang
import enLocale from './en';
import zhLocale from './zh';

Vue.use(VueI18n);

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale,
    ...vTableEnLocale
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale,
    ...vTableZhLocale
  }
};

const i18n = new VueI18n({
  // set locale  zh | en
  locale: localStorage.getItem('lang') || 'zh',
  // set locale messages
  messages
});

export default i18n;
