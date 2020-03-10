/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-10 20:01:17
 */
import Mock from 'mockjs';

export default {
  code: 1,
  message: '',
  data: Mock.mock({
    'items|200': [
      {
        'id|+1': 1,
        bjdm: 'L8W0 819 439 3456 A2',
        bjmc: '变速箱油--无极变速箱',
        dw: '桶',
        'ckdj|1-100': 100,
        'cksl|1-50': 1,
        'jcsl|1-50': 1,
        kq: 'A02',
        kw: 'B22',
        xz: '免费'
      }
    ],
    ckdh: 'DA4129405623',
    dydh: '9-A234672345',
    cx: '8E234HG A4 1.8T CVT',
    khmc: '长春通力汽车服务有限公司',
    cph: '吉A12345',
    ckkh: '01ASF7898B',
    flr: '张三',
    kgy: '李四',
    llr: '王五',
    desc: '没有问题订单，已关闭'
  })
};
