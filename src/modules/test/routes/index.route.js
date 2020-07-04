/*
 * @Author: 焦质晔
 * @Date: 2020-05-17 09:36:33
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-06-23 08:53:36
 */
export default {
  // webpackChunkName -> webpack 在打包编译时，生成的文件路径(名)，格式：模块名称/用例名称
  routes: [
    {
      path: '/bjgl/cggl/dd',
      meta: { keepAlive: true },
      component: () => import(/* webpackChunkName: "test/demo" */ '@test/pages/demo/index')
    },
    // {
    //   path: '/bjgl/cggl/dd',
    //   meta: { iframeRoutePath: '/iframe/bjgl/cggl/dd' }
    // },
    {
      path: '/bjgl/cggl/rk',
      meta: { keepAlive: true },
      component: () => import(/* webpackChunkName: "test/demo2" */ '@test/pages/demo/index2')
    },
    {
      path: '/bjgl/cggl/tk',
      meta: { keepAlive: true },
      component: () => import(/* webpackChunkName: "test/demo3" */ '@test/pages/demo/index3')
    }
  ],
  // 注意：通过 iframe 形式加载的路由页面，路由路径必须以 /iframe 开头，
  // path 的值与 iframeRoutePath 相等
  iframes: [
    {
      path: '/iframe/bjgl/cggl/dd',
      component: () => import(/* webpackChunkName: "test/demo" */ '@test/pages/demo/index')
    }
  ]
};
