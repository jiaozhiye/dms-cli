export default [
  {
    title: '备件管理',
    key: '/bjgl',
    pyt: 'bjgl',
    icon: 'el-icon-data-analysis',
    children: [
      {
        title: '采购管理',
        key: '/bjgl/cggl',
        pyt: 'cggl',
        icon: 'el-icon-folder-opened',
        children: [
          {
            title: '备件采购订单',
            key: '/bjgl/cggl/dd',
            pyt: 'bjcgdd',
            icon: ''
          },
          {
            title: '备件采购入库',
            key: '/bjgl/cggl/rk',
            pyt: 'bjcgrk',
            icon: ''
          },
          {
            title: '备件采购退库',
            key: '/bjgl/cggl/tk',
            pyt: 'bjcgtk',
            icon: ''
          }
        ]
      },
      {
        title: '库存管理',
        key: '/bjgl/kcgl',
        pyt: 'kcgl',
        icon: 'el-icon-folder-opened',
        children: [
          {
            title: '备件清单列表',
            key: '/bjgl/kcgl/lb',
            pyt: 'bjqdlb',
            icon: ''
          }
        ]
      }
    ]
  },
  {
    title: '销售管理',
    key: '/xsgl',
    pyt: 'xsgl',
    icon: 'el-icon-shopping-bag-1',
    children: [
      {
        title: '线索管理',
        key: '/xsgl/xugl',
        pyt: 'xugl',
        icon: 'el-icon-folder-opened',
        children: [
          {
            title: '线索分配',
            key: '/xsgl/xugl/fp',
            pyt: 'xsfp',
            icon: ''
          },
          {
            title: '线索记录',
            key: '/xsgl/xugl/jl',
            pyt: 'xsjl',
            icon: ''
          },
          {
            title: '线索跟进计划',
            key: '/xsgl/xugl/jh',
            pyt: 'xsjh',
            icon: ''
          },
          {
            title: '线索转移',
            key: '/xsgl/xugl/zy',
            pyt: 'xszy',
            icon: ''
          }
        ]
      },
      {
        title: '机会管理',
        key: '/xsgl/jhgl',
        pyt: 'jhgl',
        icon: 'el-icon-folder-opened',
        children: [
          {
            title: '销售机会',
            key: '/xsgl/jhgl/xsjh',
            pyt: 'xsjh',
            icon: ''
          },
          {
            title: '跟进计划设置',
            key: '/xsgl/jhgl/jhsz',
            pyt: 'gjjhsz',
            icon: ''
          },
          {
            title: '机会跟进计划',
            key: '/xsgl/jhgl/gjjh',
            pyt: 'jhgjjh',
            icon: ''
          }
        ]
      },
      {
        title: '客户管理',
        key: '/xsgl/khgl',
        pyt: 'khgl',
        icon: 'el-icon-folder-opened',
        children: [
          {
            title: '客户订单管理',
            key: '/xsgl/khgl/dd',
            pyt: 'khddgl',
            icon: ''
          },
          {
            title: '车辆资源查询',
            key: '/xsgl/khgl/cx',
            pyt: 'clzyzx',
            icon: ''
          },
          {
            title: '车辆资源管理',
            key: '/xsgl/khgl/gl',
            pyt: 'clzygl',
            icon: ''
          }
        ]
      }
    ]
  },
  {
    title: '客服管理',
    key: '/kfgl',
    pyt: 'kfgl',
    icon: 'el-icon-headset',
    children: [
      {
        title: '回访',
        key: '/kfgl/hf',
        pyt: 'hf',
        icon: 'el-icon-folder-opened',
        children: [
          {
            title: '销售回访',
            key: '/kfgl/hf/xs',
            pyt: 'xshf',
            icon: ''
          },
          {
            title: '回访分配',
            key: '/kfgl/hf/fp',
            pyt: 'hffp',
            icon: ''
          }
        ]
      },
      {
        title: '投诉',
        key: '/kfgl/ts',
        pyt: 'ts',
        icon: 'el-icon-folder-opened',
        children: [
          {
            title: '投诉管理',
            key: '/kfgl/ts/gl',
            pyt: 'tsgl',
            icon: ''
          }
        ]
      }
    ]
  }
];
