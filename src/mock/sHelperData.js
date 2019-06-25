import Mock from 'mockjs';

export default Mock.mock({
  code: 1,
  message: '',
  'data|5-20': [
    {
      name: '@cname',
      'price|20-100': 1,
      'number|1-50': 1,
      date: '@datetime'
    }
  ]
});
