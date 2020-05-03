/*
 * @Author: 焦质晔
 * @Date: 2020-04-30 14:59:03
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-03 15:26:52
 */
import VueI18n from 'vue-i18n';
import enLocale from './en';
import zhLocale from './zh';

const messages = {
  en: {
    ...enLocale
  },
  zh: {
    ...zhLocale
  }
};

const i18n = new VueI18n({
  // set locale  zh | en
  locale: localStorage.getItem('lang') || 'zh',
  // set locale messages
  messages
});

export default i18n;
