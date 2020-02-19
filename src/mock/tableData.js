/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-02-19 21:59:20
 */
import Mock from 'mockjs';

export default {
  code: 1,
  message: '',
  data: Mock.mock({
    'items|50': [
      {
        'id|+1': 1,
        person: {
          name: '@cname',
          'sex|0-1': 1,
          'age|18-60': 18
        },
        'price|1-100': 50,
        'num|1-100': 50,
        total: 0,
        date: '@datetime',
        'state|1-3': 1,
        'choice|1': ['0', '1'],
        hobby: () => {
          let data = [];
          for (let i = 0; i < 3; i++) {
            data[i] = Mock.Random.natural(1, 4);
          }
          return [...new Set(data)];
        },
        address: '@county(true)'
      }
    ],
    'total|500': 1
  })
};
