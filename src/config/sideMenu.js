export default [
  {
    title: '备件管理',
    key: '/bjgl',
    icon: 'el-icon-data-analysis',
    children: [
      {
        title: '采购管理',
        key: '/bjgl/cggl',
        icon: 'el-icon-folder-opened',
        children: [
          {
            title: '备件采购订单',
            key: '/bjgl/cggl/dd',
            icon: ''
          },
          {
            title: '备件采购入库',
            key: '/bjgl/cggl/rk',
            icon: ''
          },
          {
            title: '备件采购退库',
            key: '/bjgl/cggl/tk',
            icon: ''
          }
        ]
      },
      {
        title: '库存管理',
        key: '/bjgl/kcgl',
        icon: 'el-icon-folder-opened',
        children: [
          {
            title: '备件清单列表',
            key: '/bjgl/kcgl/lb',
            icon: ''
          }
        ]
      }
    ]
  },
  {
    title: '销售管理',
    key: '/xsgl',
    icon: 'el-icon-shopping-bag-1',
    children: [
      {
        title: '线索管理',
        key: '/xsgl/xugl',
        icon: 'el-icon-folder-opened',
        children: [
          {
            title: '线索分配',
            key: '/xsgl/xugl/fp',
            icon: ''
          },
          {
            title: '线索记录',
            key: '/xsgl/xugl/jl',
            icon: ''
          },
          {
            title: '线索跟进计划',
            key: '/xsgl/xugl/jh',
            icon: ''
          },
          {
            title: '线索转移',
            key: '/xsgl/xugl/zy',
            icon: ''
          }
        ]
      },
      {
        title: '机会管理',
        key: '/xsgl/jhgl',
        icon: 'el-icon-folder-opened',
        children: [
          {
            title: '销售机会',
            key: '/xsgl/jhgl/xsjh',
            icon: ''
          },
          {
            title: '跟进计划设置',
            key: '/xsgl/jhgl/jhsz',
            icon: ''
          },
          {
            title: '机会跟进计划',
            key: '/xsgl/jhgl/gjjh',
            icon: ''
          }
        ]
      },
      {
        title: '客户管理',
        key: '/xsgl/khgl',
        icon: 'el-icon-folder-opened',
        children: [
          {
            title: '客户订单管理',
            key: '/xsgl/khgl/dd',
            icon: ''
          },
          {
            title: '车辆资源查询',
            key: '/xsgl/khgl/cx',
            icon: ''
          },
          {
            title: '车辆资源管理',
            key: '/xsgl/khgl/gl',
            icon: ''
          }
        ]
      }
    ]
  },
  {
    title: '客服管理',
    key: '/kfgl',
    icon: 'el-icon-headset',
    children: [
      {
        title: '回访',
        key: '/kfgl/hf',
        icon: 'el-icon-folder-opened',
        children: [
          {
            title: '销售回访',
            key: '/kfgl/hf/xs',
            icon: ''
          },
          {
            title: '回访分配',
            key: '/kfgl/hf/fp',
            icon: ''
          }
        ]
      },
      {
        title: '投诉',
        key: '/kfgl/ts',
        icon: 'el-icon-folder-opened',
        children: [
          {
            title: '投诉管理',
            key: '/kfgl/ts/gl',
            icon: ''
          }
        ]
      }
    ]
  }
];
