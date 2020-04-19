/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-19 08:55:13
 */
export default [
  {
    title: '备件管理',
    key: '/bjgl',
    icon: 'icon-shop',
    children: [
      {
        title: '采购管理',
        key: '/bjgl/cggl',
        children: [
          {
            title: '备件采购订单',
            key: '/bjgl/cggl/dd',
            permission: ['save', 'update']
          },
          {
            title: '备件采购入库',
            key: '/bjgl/cggl/rk'
          },
          {
            title: '备件采购退库',
            key: '/bjgl/cggl/tk'
          }
        ]
      },
      {
        title: '库存管理',
        key: '/bjgl/kcgl',
        children: [
          {
            title: '备件清单列表',
            key: 'https://www.baidu.com/'
          }
        ]
      }
    ]
  },
  {
    title: '销售管理',
    key: '/xsgl',
    icon: 'icon-barchart',
    children: [
      {
        title: '线索管理',
        key: '/xsgl/xugl',
        children: [
          {
            title: '线索分配',
            key: '/xsgl/xugl/fp'
          },
          {
            title: '线索记录',
            key: '/xsgl/xugl/jl'
          },
          {
            title: '线索跟进计划',
            key: '/xsgl/xugl/jh'
          },
          {
            title: '线索转移',
            key: '/xsgl/xugl/zy'
          }
        ]
      },
      {
        title: '机会管理',
        key: '/xsgl/jhgl',
        children: [
          {
            title: '销售机会',
            key: '/xsgl/jhgl/xsjh'
          },
          {
            title: '跟进计划设置',
            key: '/xsgl/jhgl/jhsz'
          },
          {
            title: '机会跟进计划',
            key: '/xsgl/jhgl/gjjh'
          }
        ]
      },
      {
        title: '客户管理',
        key: '/xsgl/khgl',
        children: [
          {
            title: '客户订单管理',
            key: '/xsgl/khgl/dd'
          },
          {
            title: '车辆资源查询',
            key: '/xsgl/khgl/cx'
          },
          {
            title: '车辆资源管理',
            key: '/xsgl/khgl/gl'
          }
        ]
      }
    ]
  },
  {
    title: '客服管理',
    key: '/kfgl',
    icon: 'icon-customerservice',
    children: [
      {
        title: '回访',
        key: '/kfgl/hf',
        children: [
          {
            title: '销售回访',
            key: '/kfgl/hf/xs'
          },
          {
            title: '回访分配',
            key: '/kfgl/hf/fp'
          }
        ]
      },
      {
        title: '投诉',
        key: '/kfgl/ts',
        children: [
          {
            title: '投诉管理',
            key: '/kfgl/ts/gl'
          }
        ]
      }
    ]
  }
];
