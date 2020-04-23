/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-24 01:58:00
 */
'use strict';

const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const path = require('path');
const Dotenv = require('dotenv-webpack');
const baseWebpackConfig = require('./webpack.base.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

process.env.NODE_ENV = 'development';

const HOST = process.env.HOST || config.dev.host;
const PORT = process.env.PORT || config.dev.port;

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: false })
  },
  devtool: config.dev.devtool,
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      disableDotRule: true
    },
    publicPath: config.dev.assetsPublicPath,
    contentBase: false, // since we use CopyWebpackPlugin.
    inline: true,
    hot: true, // 热加载
    compress: true, // 开启资源的 gzip 压缩
    overlay: {
      warnings: false,
      errors: true // webpack 在编译的时候如果出现了错误，可以在网页上显示
    },
    host: HOST,
    port: PORT,
    open: config.dev.autoOpenBrowser,
    proxy: config.dev.proxyTable,
    watchOptions: { poll: false }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new Dotenv(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'public/index.html',
      inject: true,
      favicon: 'public/favicon.ico',
      templateParameters: {
        BASE_URL: config.dev.assetsPublicPath + config.dev.assetsSubDirectory
      }
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
});

module.exports = devWebpackConfig;
