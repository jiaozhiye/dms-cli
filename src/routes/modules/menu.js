/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-18 21:39:19
 */
import { asyncLoadComponent } from '@/utils';

// 菜单路由
export default [
  {
    path: '/bjgl/cggl/dd',
    meta: { title: '备件采购订单', keepAlive: true },
    component: asyncLoadComponent('demo/index')
  },
  {
    path: '/bjgl/cggl/rk',
    meta: { title: '备件采购入库', keepAlive: true },
    component: asyncLoadComponent('dashboard/index')
  },
  {
    path: '/bjgl/cggl/tk',
    meta: { title: '备件采购退库', keepAlive: true },
    component: asyncLoadComponent('dashboard/index')
  },
  {
    path: '/xsgl/xugl/fp',
    meta: { title: '线索分配', keepAlive: true },
    component: asyncLoadComponent('dashboard/index')
  },
  {
    path: '/xsgl/xugl/jl',
    meta: { title: '线索记录', keepAlive: true },
    component: asyncLoadComponent('dashboard/index')
  },
  {
    path: '/xsgl/xugl/jh',
    meta: { title: '线索跟进计划', keepAlive: true },
    component: asyncLoadComponent('dashboard/index')
  },
  {
    path: '/xsgl/xugl/zy',
    meta: { title: '线索转移', keepAlive: true },
    component: asyncLoadComponent('dashboard/index')
  },
  {
    path: '/xsgl/jhgl/xsjh',
    meta: { title: '销售机会', keepAlive: true },
    component: asyncLoadComponent('dashboard/index')
  },
  {
    path: '/xsgl/jhgl/jhsz',
    meta: { title: '跟进计划设置', keepAlive: true },
    component: asyncLoadComponent('dashboard/index')
  },
  {
    path: '/xsgl/jhgl/gjjh',
    meta: { title: '机会跟进计划', keepAlive: true },
    component: asyncLoadComponent('dashboard/index')
  },
  {
    path: '/xsgl/khgl/dd',
    meta: { title: '客户订单管理', keepAlive: true },
    component: asyncLoadComponent('dashboard/index')
  },
  {
    path: '/xsgl/khgl/cx',
    meta: { title: '车辆资源查询', keepAlive: true },
    component: asyncLoadComponent('dashboard/index')
  },
  {
    path: '/xsgl/khgl/gl',
    meta: { title: '车辆资源管理', keepAlive: true },
    component: asyncLoadComponent('dashboard/index')
  },
  {
    path: '/kfgl/hf/xs',
    meta: { title: '销售回访', keepAlive: true },
    component: asyncLoadComponent('dashboard/index')
  },
  {
    path: '/kfgl/hf/fp',
    meta: { title: '回访分配', keepAlive: true },
    component: asyncLoadComponent('dashboard/index')
  },
  {
    path: '/kfgl/ts/gl',
    meta: { title: '投诉管理', keepAlive: true },
    component: asyncLoadComponent('dashboard/index')
  }
];
