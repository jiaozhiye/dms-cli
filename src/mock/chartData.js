/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 10:00:00
 */
export default {
  chart1: {
    names: ['奥迪A4', '奥迪A6', '奥迪A8', '奥迪Q3', '奥迪Q5', '奥迪Q7'],
    values: [120, 149, 127, 130, 225, 133]
  },
  chart2: {
    names: ['一月', '二月', '三月', '四月', '五月', '六月'],
    values: [
      {
        name: '本年销量',
        type: 'line',
        data: [120, 132, 101, 134, 90, 230]
      },
      {
        name: '上年销量',
        type: 'line',
        data: [220, 182, 191, 234, 290, 330]
      }
    ]
  },
  chart3: {
    values: [{ value: 135, name: '邮件营销' }, { value: 148, name: '联盟广告' }, { value: 251, name: '视频广告' }, { value: 151, name: '媒体广告' }, { value: 102, name: '其他' }]
  },
  chart4: {
    values: [{ value: 20, name: '邮件营销' }, { value: 40, name: '联盟广告' }, { value: 60, name: '视频广告' }, { value: 80, name: '其他' }]
  }
};
