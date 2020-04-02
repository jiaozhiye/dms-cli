/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-02 10:36:43
 */
'use strict';
const path = require('path');

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    // 请求代理配置 -> can be modified
    proxyTable: {
      '/api': {
        target: 'http://jettadms-test.faw-vw.com',
        changeOrigin: true, // 支持跨域
        secure: false, // 支持 https
        pathRewrite: {
          '^/api': '/api'
        }
      }
    },
    // 请求代理配置 END

    // Various Dev Server settings
    host: 'localhost',
    port: 8081,
    autoOpenBrowser: true,

    // Use Eslint
    useEslint: true,

    // Source Maps
    devtool: 'cheap-source-map',
    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    // Source Maps
    productionSourceMap: false,
    devtool: 'source-map',

    // Gzip
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  }
};
