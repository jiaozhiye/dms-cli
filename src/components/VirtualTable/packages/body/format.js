/*
 * @Author: 焦质晔
 * @Date: 2020-03-23 12:51:24
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-23 17:07:55
 */
import moment from 'moment';
import { formatNumber } from '../utils';

const formatMixin = {
  dateFormat(val) {
    return moment(val).format('YYYY-MM-DD');
  },
  datetimeFormat(val) {
    return moment(val).format('YYYY-MM-DD HH:mm:ss');
  },
  financeFormat(val) {
    return formatNumber(val);
  },
  [`secret-nameFormat`](val) {
    //
  },
  [`secret-phoneFormat`](val) {
    //
  }
};

export default formatMixin;
