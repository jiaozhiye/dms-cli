'use strict';
const path = require('path');

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      // '/api': {
      //   target: 'http://www.server.com/',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/api': '/cms-api'
      //   }
      // }
    },

    // Various Dev Server settings
    host: 'localhost',
    port: 8080,
    autoOpenBrowser: true,

    /**
     * Source Maps
     */
    devtool: 'cheap-module-eval-source-map',
    cacheBusting: true,
    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '',

    /**
     * Source Maps
     */
    productionSourceMap: false,
    devtool: '#source-map'
  }
};
