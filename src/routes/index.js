/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-06 00:10:53
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import moduleRoutes from './modules';
import iframeRoutes from './modules/iframe';
import i18n from '@/lang';

Vue.use(VueRouter);

const BasicLayout = () => import('@/layout/BasicLayout');
const Login = () => import('@/pages/login');
const Dashboard = () => import('@/pages/dashboard');
const Redirect = () => import('@/pages/redirect');
const Nomatch = () => import('@/pages/nomatch');

// 基础路由
export const constantRouterMap = [
  {
    path: '/login',
    meta: { title: i18n.t('login.title') },
    component: Login,
    hidden: true
  },
  ...iframeRoutes,
  {
    path: '/',
    meta: { title: i18n.t('app.home') },
    redirect: '/home',
    component: BasicLayout,
    children: [
      {
        path: '/home',
        meta: { title: i18n.t('app.dashboard'), affix: true, bgColor: true, keepAlive: false },
        component: Dashboard
      },
      ...moduleRoutes,
      {
        path: '/redirect/:path(.*)',
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
