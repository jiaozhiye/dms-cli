const RouteView = () => import('@/layout/RouteView');
const loadComponent = name => () => import(`@/pages/${name}`);

// 菜单路由
const menuRoutes = [
  {
    path: '/bjgl',
    meta: { title: '备件管理' },
    redirect: '/bjgl/cggl',
    component: RouteView,
    children: [
      {
        path: '/bjgl/cggl',
        meta: { title: '采购管理' },
        redirect: '/bjgl/cggl/dd',
        component: RouteView,
        children: [
          {
            path: '/bjgl/cggl/dd',
            meta: {
              title: '备件采购订单',
              keepAlive: true,
              permission: []
            },
            component: loadComponent('test/index')
          },
          {
            path: '/bjgl/cggl/rk',
            meta: {
              title: '备件采购入库',
              keepAlive: true,
              permission: []
            },
            component: loadComponent('home/index')
          },
          {
            path: '/bjgl/cggl/tk',
            meta: {
              title: '备件采购退库',
              keepAlive: true,
              permission: []
            },
            component: loadComponent('home/index')
          }
        ]
      },
      {
        path: '/bjgl/kcgl',
        meta: { title: '库存管理' },
        redirect: '/bjgl/kcgl/lb',
        component: RouteView,
        children: [
          {
            path: '/bjgl/kcgl/lb',
            meta: {
              title: '备件清单列表',
              keepAlive: true,
              permission: []
            },
            component: loadComponent('home/index')
          }
        ]
      }
    ]
  },
  {
    path: '/xsgl',
    meta: { title: '销售管理' },
    redirect: '/xsgl/xugl',
    component: RouteView,
    children: [
      {
        path: '/xsgl/xugl',
        meta: { title: '线索管理' },
        redirect: '/xsgl/xugl/fp',
        component: RouteView,
        children: [
          {
            path: '/xsgl/xugl/fp',
            meta: {
              title: '线索分配',
              keepAlive: true,
              permission: []
            },
            component: loadComponent('home/index')
          },
          {
            path: '/xsgl/xugl/jl',
            meta: {
              title: '线索记录',
              keepAlive: true,
              permission: []
            },
            component: loadComponent('home/index')
          },
          {
            path: '/xsgl/xugl/jh',
            meta: {
              title: '线索跟进计划',
              keepAlive: true,
              permission: []
            },
            component: loadComponent('home/index')
          },
          {
            path: '/xsgl/xugl/zy',
            meta: {
              title: '线索转移',
              keepAlive: true,
              permission: []
            },
            component: loadComponent('home/index')
          }
        ]
      },
      {
        path: '/xsgl/jhgl',
        meta: { title: '机会管理' },
        redirect: '/xsgl/jhgl/xsjh',
        component: RouteView,
        children: [
          {
            path: '/xsgl/jhgl/xsjh',
            meta: {
              title: '销售机会',
              keepAlive: true,
              permission: []
            },
            component: loadComponent('home/index')
          },
          {
            path: '/xsgl/jhgl/jhsz',
            meta: {
              title: '跟进计划设置',
              keepAlive: true,
              permission: []
            },
            component: loadComponent('home/index')
          },
          {
            path: '/xsgl/jhgl/gjjh',
            meta: {
              title: '机会跟进计划',
              keepAlive: true,
              permission: []
            },
            component: loadComponent('home/index')
          }
        ]
      },
      {
        path: '/xsgl/khgl',
        meta: { title: '客户管理' },
        redirect: '/xsgl/khgl/dd',
        component: RouteView,
        children: [
          {
            path: '/xsgl/khgl/dd',
            meta: {
              title: '客户订单管理',
              keepAlive: true,
              permission: []
            },
            component: loadComponent('home/index')
          },
          {
            path: '/xsgl/khgl/cx',
            meta: {
              title: '车辆资源查询',
              keepAlive: true,
              permission: []
            },
            component: loadComponent('home/index')
          },
          {
            path: '/xsgl/khgl/gl',
            meta: {
              title: '车辆资源管理',
              keepAlive: true,
              permission: []
            },
            component: loadComponent('home/index')
          }
        ]
      }
    ]
  },
  {
    path: '/kfgl',
    meta: { title: '客服管理' },
    redirect: '/kfgl/hf',
    component: RouteView,
    children: [
      {
        path: '/kfgl/hf',
        meta: { title: '回访' },
        redirect: '/kfgl/hf/xs',
        component: RouteView,
        children: [
          {
            path: '/kfgl/hf/xs',
            meta: {
              title: '销售回访',
              keepAlive: true,
              permission: []
            },
            component: loadComponent('home/index')
          },
          {
            path: '/kfgl/hf/fp',
            meta: {
              title: '回访分配',
              keepAlive: true,
              permission: []
            },
            component: loadComponent('home/index')
          }
        ]
      },
      {
        path: '/kfgl/ts',
        meta: { title: '投诉' },
        redirect: '/kfgl/ts/gl',
        component: RouteView,
        children: [
          {
            path: '/kfgl/ts/gl',
            meta: {
              title: '投诉管理',
              keepAlive: true,
              permission: []
            },
            component: loadComponent('home/index')
          }
        ]
      }
    ]
  }
];

export default menuRoutes;
