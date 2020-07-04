/*
 * @Author: 焦质晔
 * @Date: 2020-05-14 19:27:24
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-14 20:01:42
 */
import i18n from '@/lang';

import enLocale from './en';
import zhLocale from './zh';

(function(data) {
  for (let key in data) {
    i18n.mergeLocaleMessage(key, data[key]);
  }
})({ en: enLocale, zh: zhLocale });
