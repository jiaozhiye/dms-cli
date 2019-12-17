/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-12-17 10:36:00
 */
'use strict';

const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const { VueLoaderPlugin } = require('vue-loader');

// 多进程处理 Loader
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

// Eslint 校验
const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [utils.resolve('src')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: true
  }
});

module.exports = {
  context: utils.resolve('/'),
  entry: {
    app: ['babel-polyfill', utils.resolve('src/main.js')]
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    // 配置解析规则
    extensions: ['.js', '.jsx', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': utils.resolve('src')
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            ...utils.cssLoaders({
              sourceMap: process.env.NODE_ENV === 'production' ? config.build.productionSourceMap : config.dev.cssSourceMap,
              extract: process.env.NODE_ENV === 'production'
            }),
            js: 'happypack/loader?id=babel'
          }
        }
      },
      {
        test: /\.(js|jsx)$/,
        use: 'happypack/loader?id=babel',
        include: [utils.resolve('src')],
        exclude: /node_modules/
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [utils.resolve('src/components/SvgIcon/svg')],
        options: {
          symbolId: 'icon-[name]'
        }
      },
      {
        test: /\.(png|jpe?g|svg|gif|ico)(\?.*)?$/,
        loader: 'url-loader',
        exclude: [utils.resolve('src/components/SvgIcon/svg')],
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HappyPack({
      id: 'babel',
      loaders: ['babel-loader?cacheDirectory=true'],
      threadPool: happyThreadPool,
      verbose: true
    })
  ]
};
