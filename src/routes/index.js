import Vue from 'vue';
import VueRouter from 'vue-router';
import menuRoutes from './menu';
Vue.use(VueRouter);

const BasicLayout = () => import('@/layout/BasicLayout');
const NoMatch = () => import('@/pages/noMatch/index');
const Login = () => import('@/pages/login/index');
const Home = () => import('@/pages/home/index');

// 基础路由
export const constantRouterMap = [
  {
    path: '/login',
    meta: { title: '登录页' },
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
        meta: {
          title: '概览',
          keepAlive: true,
          permission: []
        },
        component: Home
      },
      ...menuRoutes
    ]
  },
  {
    path: '/404',
    component: NoMatch
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
