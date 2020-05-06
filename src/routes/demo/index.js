/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-06 11:01:21
 */
import { asyncLoadComponent } from '@/utils';

// 菜单路由
export const routes = [
  {
    path: '/test',
    meta: { keepAlive: true },
    component: asyncLoadComponent('demo/index')
  },
  {
    path: '/bjgl/cggl/dd',
    meta: { keepAlive: true },
    component: asyncLoadComponent('demo/index')
  },
  // {
  //   path: '/bjgl/cggl/dd',
  //   meta: { iframeRoutePath: '/iframe/test' }
  // },
  {
    path: '/bjgl/cggl/rk',
    meta: { keepAlive: true },
    component: asyncLoadComponent('demo/index0000')
  },
  {
    path: '/bjgl/cggl/tk',
    meta: { keepAlive: false },
    component: asyncLoadComponent('dashboard/index')
  },
  {
    path: '/xsgl/xugl/fp',
    meta: { keepAlive: false },
    component: asyncLoadComponent('dashboard/index')
  },
  {
    path: '/xsgl/xugl/jl',
    meta: { keepAlive: false },
    component: asyncLoadComponent('dashboard/index')
  },
  {
    path: '/xsgl/xugl/jh',
    meta: { keepAlive: false },
    component: asyncLoadComponent('dashboard/index')
  },
  {
    path: '/xsgl/xugl/zy',
    meta: { keepAlive: false },
    component: asyncLoadComponent('dashboard/index')
  },
  {
    path: '/xsgl/jhgl/xsjh',
    meta: { keepAlive: false },
    component: asyncLoadComponent('dashboard/index')
  },
  {
    path: '/xsgl/jhgl/jhsz',
    meta: { keepAlive: false },
    component: asyncLoadComponent('dashboard/index')
  },
  {
    path: '/xsgl/jhgl/gjjh',
    meta: { keepAlive: false },
    component: asyncLoadComponent('dashboard/index')
  },
  {
    path: '/xsgl/khgl/dd',
    meta: { keepAlive: false },
    component: asyncLoadComponent('dashboard/index')
  },
  {
    path: '/xsgl/khgl/cx',
    meta: { keepAlive: false },
    component: asyncLoadComponent('dashboard/index')
  },
  {
    path: '/xsgl/khgl/gl',
    meta: { keepAlive: false },
    component: asyncLoadComponent('dashboard/index')
  },
  {
    path: '/kfgl/hf/xs',
    meta: { keepAlive: false },
    component: asyncLoadComponent('dashboard/index')
  },
  {
    path: '/kfgl/hf/fp',
    meta: { keepAlive: false },
    component: asyncLoadComponent('dashboard/index')
  },
  {
    path: '/kfgl/ts/gl',
    meta: { keepAlive: false },
    component: asyncLoadComponent('dashboard/index')
  }
];

// 注意：通过 iframe 形式加载的路由页面，路由路径必须以 /iframe 开头，
// path 的值与 iframeRoutePath 相等

// iframe 路由
export const iframes = [
  {
    path: '/iframe/test',
    component: asyncLoadComponent('demo/index')
  }
];
