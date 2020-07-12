/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-10 15:42:04
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import i18n from '@/lang';
import routes from './routes';

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
  ...routes.map(x => x.iframes).flat(),
  // 大屏
  {
    path: '/iframe/big-screen/demo',
    component: () => import(/* webpackChunkName: "bigScreen/demo" */ '@/pages/bigScreen/index')
  },
  // 大屏 END
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
      ...routes.map(x => x.routes).flat(),
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

// 解决 ElementUI 导航栏中的 vue-router 在 3.0 版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

export default new VueRouter({
  mode: 'history',
  routes: constantRouterMap,
  scrollBehavior: () => ({ y: 0 })
});
