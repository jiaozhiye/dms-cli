/**
 * @Author: 焦质晔
 * @Date: 2019/6/20
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 15:45:00
 */
const RouteView = () => import('@/layout/RouteView');
// 异步路由组件加载
const AsyncComponent = __name__ => () => import(`@/pages/${__name__}`);

// 菜单路由
const menuRoutes = [
  {
    path: '/bjgl',
    meta: { title: '备件管理', icon: 'el-icon-data-analysis' },
    redirect: '/bjgl/cggl',
    component: RouteView,
    children: [
      {
        path: '/bjgl/cggl',
        meta: { title: '采购管理', icon: 'el-icon-folder-opened' },
        redirect: '/bjgl/cggl/dd',
        component: RouteView,
        children: [
          {
            path: '/bjgl/cggl/dd',
            meta: { title: '备件采购订单', keepAlive: true },
            component: AsyncComponent('demo/index')
          },
          {
            path: '/bjgl/cggl/rk',
            meta: { title: '备件采购入库', keepAlive: true },
            component: AsyncComponent('home/index')
          },
          {
            path: '/bjgl/cggl/tk',
            meta: { title: '备件采购退库', keepAlive: true },
            component: AsyncComponent('home/index')
          }
        ]
      },
      {
        path: '/bjgl/kcgl',
        meta: { title: '库存管理', icon: 'el-icon-folder-opened' },
        redirect: '/bjgl/kcgl/lb',
        component: RouteView,
        children: [
          {
            path: '/bjgl/kcgl/lb',
            meta: { title: '备件清单列表', keepAlive: true },
            component: AsyncComponent('home/index')
          }
        ]
      }
    ]
  },
  {
    path: '/xsgl',
    meta: { title: '销售管理', icon: 'el-icon-shopping-bag-1' },
    redirect: '/xsgl/xugl',
    component: RouteView,
    children: [
      {
        path: '/xsgl/xugl',
        meta: { title: '线索管理', icon: 'el-icon-folder-opened' },
        redirect: '/xsgl/xugl/fp',
        component: RouteView,
        children: [
          {
            path: '/xsgl/xugl/fp',
            meta: { title: '线索分配', keepAlive: true },
            component: AsyncComponent('home/index')
          },
          {
            path: '/xsgl/xugl/jl',
            meta: { title: '线索记录', keepAlive: true },
            component: AsyncComponent('home/index')
          },
          {
            path: '/xsgl/xugl/jh',
            meta: { title: '线索跟进计划', keepAlive: true },
            component: AsyncComponent('home/index')
          },
          {
            path: '/xsgl/xugl/zy',
            meta: { title: '线索转移', keepAlive: true },
            component: AsyncComponent('home/index')
          }
        ]
      },
      {
        path: '/xsgl/jhgl',
        meta: { title: '机会管理', icon: 'el-icon-folder-opened' },
        redirect: '/xsgl/jhgl/xsjh',
        component: RouteView,
        children: [
          {
            path: '/xsgl/jhgl/xsjh',
            meta: { title: '销售机会', keepAlive: true },
            component: AsyncComponent('home/index')
          },
          {
            path: '/xsgl/jhgl/jhsz',
            meta: { title: '跟进计划设置', keepAlive: true },
            component: AsyncComponent('home/index')
          },
          {
            path: '/xsgl/jhgl/gjjh',
            meta: { title: '机会跟进计划', keepAlive: true },
            component: AsyncComponent('home/index')
          }
        ]
      },
      {
        path: '/xsgl/khgl',
        meta: { title: '客户管理', icon: 'el-icon-folder-opened' },
        redirect: '/xsgl/khgl/dd',
        component: RouteView,
        children: [
          {
            path: '/xsgl/khgl/dd',
            meta: { title: '客户订单管理', keepAlive: true },
            component: AsyncComponent('home/index')
          },
          {
            path: '/xsgl/khgl/cx',
            meta: { title: '车辆资源查询', keepAlive: true },
            component: AsyncComponent('home/index')
          },
          {
            path: '/xsgl/khgl/gl',
            meta: { title: '车辆资源管理', keepAlive: true },
            component: AsyncComponent('home/index')
          }
        ]
      }
    ]
  },
  {
    path: '/kfgl',
    meta: { title: '客服管理', icon: 'el-icon-headset' },
    redirect: '/kfgl/hf',
    component: RouteView,
    children: [
      {
        path: '/kfgl/hf',
        meta: { title: '回访', icon: 'el-icon-folder-opened' },
        redirect: '/kfgl/hf/xs',
        component: RouteView,
        children: [
          {
            path: '/kfgl/hf/xs',
            meta: { title: '销售回访', keepAlive: true },
            component: AsyncComponent('home/index')
          },
          {
            path: '/kfgl/hf/fp',
            meta: { title: '回访分配', keepAlive: true },
            component: AsyncComponent('home/index')
          }
        ]
      },
      {
        path: '/kfgl/ts',
        meta: { title: '投诉', icon: 'el-icon-folder-opened' },
        redirect: '/kfgl/ts/gl',
        component: RouteView,
        children: [
          {
            path: '/kfgl/ts/gl',
            meta: { title: '投诉管理', keepAlive: true },
            component: AsyncComponent('home/index')
          }
        ]
      }
    ]
  }
];

export default menuRoutes;
