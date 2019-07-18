/**
 * @Author: 焦质晔
 * @Date: 2019/6/20
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 15:45:00
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import menuRoutes from './menu';
Vue.use(VueRouter);

const BasicLayout = () => import('@/layout/BasicLayout');
const RouteView = () => import('@/layout/RouteView');
const Login = () => import('@/pages/login');
const Dashboard = () => import('@/pages/dashboard');
const Redirect = () => import('@/pages/redirect');
const Nomatch = () => import('@/pages/nomatch');

// 基础路由
export const constantRouterMap = [
  {
    path: '/login',
    meta: { title: '用户登录' },
    component: Login,
    hidden: true
  },
  {
    path: '/',
    meta: { title: '首页' },
    redirect: '/home',
    component: BasicLayout,
    children: [
      {
        path: '/home',
        meta: { breadcrumb: false },
        component: RouteView,
        children: [
          {
            path: '',
            meta: { breadcrumb: false },
            component: RouteView,
            children: [
              {
                path: '',
                meta: { title: '概览' },
                component: Dashboard
              }
            ]
          }
        ]
      },
      ...menuRoutes
    ]
  },
  {
    path: '/redirect',
    component: BasicLayout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: Redirect
      }
    ]
  },
  {
    path: '/404',
    hidden: true,
    component: Nomatch
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
];

export default new VueRouter({
  mode: 'history',
  routes: constantRouterMap,
  scrollBehavior: () => ({ y: 0 })
});
