/*
 * @Author: 焦质晔
 * @Date: 2020-03-23 12:51:24
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-09 13:14:43
 */
import moment from 'moment';
import { formatNumber } from '../utils';

const formatMixin = {
  methods: {
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
      return val.replace(/^([\u4e00-\u9fa5]{1}).+$/, '$1**');
    },
    [`secret-phoneFormat`](val) {
      return val.replace(/^(\d{3}).+(\d{4})$/, '$1****$2');
    },
    [`secret-IDnumber`](val) {
      return val.replace(/^(\d{3}).+(\w{4})$/, '$1***********$2');
    }
  }
};

export default formatMixin;
