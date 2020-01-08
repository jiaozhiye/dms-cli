/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-01-08 15:01:53
 */
import Mock from 'mockjs';

export default Mock.mock({
  code: 1,
  message: '',
  'data|5-20': [
    {
      'id|+1': 1,
      name: '@cname',
      'price|20-100': 1,
      'number|1-50': 1,
      date: '@datetime'
    }
  ]
});
