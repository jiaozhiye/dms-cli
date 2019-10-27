/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 10:00:00
 */
export default [
  {
    title: '备件管理',
    key: '/bjgl',
    pyt: 'bjgl',
    children: [
      {
        title: '采购管理',
        key: '/bjgl/cggl',
        pyt: 'cggl',
        children: [
          {
            title: '备件采购订单',
            key: '/bjgl/cggl/dd',
            pyt: 'bjcgdd',
            permission: ['/api/aaa', '/api/bbb/*']
          },
          {
            title: '备件采购入库',
            key: '/bjgl/cggl/rk',
            pyt: 'bjcgrk'
          },
          {
            title: '备件采购退库',
            key: '/bjgl/cggl/tk',
            pyt: 'bjcgtk'
          }
        ]
      },
      {
        title: '库存管理',
        key: '/bjgl/kcgl',
        pyt: 'kcgl',
        children: [
          {
            title: '备件清单列表',
            key: '/bjgl/kcgl/lb',
            pyt: 'bjqdlb'
          }
        ]
      }
    ]
  },
  {
    title: '销售管理',
    key: '/xsgl',
    pyt: 'xsgl',
    children: [
      {
        title: '线索管理',
        key: '/xsgl/xugl',
        pyt: 'xugl',
        children: [
          {
            title: '线索分配',
            key: '/xsgl/xugl/fp',
            pyt: 'xsfp'
          },
          {
            title: '线索记录',
            key: '/xsgl/xugl/jl',
            pyt: 'xsjl'
          },
          {
            title: '线索跟进计划',
            key: '/xsgl/xugl/jh',
            pyt: 'xsjh'
          },
          {
            title: '线索转移',
            key: '/xsgl/xugl/zy',
            pyt: 'xszy'
          }
        ]
      },
      {
        title: '机会管理',
        key: '/xsgl/jhgl',
        pyt: 'jhgl',
        children: [
          {
            title: '销售机会',
            key: '/xsgl/jhgl/xsjh',
            pyt: 'xsjh'
          },
          {
            title: '跟进计划设置',
            key: '/xsgl/jhgl/jhsz',
            pyt: 'gjjhsz'
          },
          {
            title: '机会跟进计划',
            key: '/xsgl/jhgl/gjjh',
            pyt: 'jhgjjh'
          }
        ]
      },
      {
        title: '客户管理',
        key: '/xsgl/khgl',
        pyt: 'khgl',
        children: [
          {
            title: '客户订单管理',
            key: '/xsgl/khgl/dd',
            pyt: 'khddgl'
          },
          {
            title: '车辆资源查询',
            key: '/xsgl/khgl/cx',
            pyt: 'clzyzx'
          },
          {
            title: '车辆资源管理',
            key: '/xsgl/khgl/gl',
            pyt: 'clzygl'
          }
        ]
      }
    ]
  },
  {
    title: '客服管理',
    key: '/kfgl',
    pyt: 'kfgl',
    children: [
      {
        title: '回访',
        key: '/kfgl/hf',
        pyt: 'hf',
        children: [
          {
            title: '销售回访',
            key: '/kfgl/hf/xs',
            pyt: 'xshf'
          },
          {
            title: '回访分配',
            key: '/kfgl/hf/fp',
            pyt: 'hffp'
          }
        ]
      },
      {
        title: '投诉',
        key: '/kfgl/ts',
        pyt: 'ts',
        children: [
          {
            title: '投诉管理',
            key: '/kfgl/ts/gl',
            pyt: 'tsgl'
          }
        ]
      }
    ]
  }
];
