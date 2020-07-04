/*
 * @Author: 焦质晔
 * @Date: 2020-05-23 22:08:32
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-23 22:17:54
 */
import { t } from '../../locale';

export default {
  methods: {
    t(...args) {
      return t.apply(this, args);
    }
  }
};
