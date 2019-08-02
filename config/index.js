/**
 * @Author: 焦质晔
 * @Date: 2019/6/20
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 15:45:00
 */
'use strict';

const path = require('path');
module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    // http proxy
    proxyTable: {
      '/api': {
        target: 'http://jettadms-test.faw-vw.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    },

    // Various Dev Server settings
    host: '127.0.0.1',
    port: 8080,
    autoOpenBrowser: true,

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
    assetsPublicPath: '',

    // Source Maps
    productionSourceMap: false,
    devtool: 'source-map',

    // Gzip
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  }
};
