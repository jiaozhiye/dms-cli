/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-05 23:58:44
 */
import { asyncLoadComponent } from '@/utils';

// 注意：通过 iframe 形式加载的路由页面，路由路径必须以 /iframe 开头，
// path 的值与 iframeRoutePath 相等

// iframe 路由
export default [
  {
    path: '/iframe/test',
    component: asyncLoadComponent('demo/index')
  }
];
