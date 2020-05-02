/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-02 15:27:18
 */
import { asyncLoadComponent } from '@/utils';

// 菜单路由
export default [
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
