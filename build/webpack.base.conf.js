/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-26 14:44:36
 */
'use strict';

const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const { VueLoaderPlugin } = require('vue-loader');
const ThemeColorReplacer = require('webpack-custom-theme');
const forElementUI = require('webpack-custom-theme/forElementUI');

// 主题色
const primaryColor = '#0d74b5';

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
    app: [utils.resolve('src/main.js')]
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
      '@': utils.resolve('src'),
      '@test': utils.resolve('src/modules/test'),
      '@system': utils.resolve('src/modules/system'),
      '@sales': utils.resolve('src/modules/sales'),
      '@service': utils.resolve('src/modules/service'),
      '@usedcar': utils.resolve('src/modules/usedcar'),
      '@others': utils.resolve('src/modules/others')
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: utils.cssLoaders({
            sourceMap: process.env.NODE_ENV === 'production' ? config.build.productionSourceMap : config.dev.cssSourceMap,
            extract: process.env.NODE_ENV === 'production'
          })
        }
      },
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader?cacheDirectory',
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
          name: utils.assetsPath('img/[name].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[ext]')
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        ENV_CONFIG: JSON.stringify(process.env.ENV_CONFIG)
      }
    }),
    new ThemeColorReplacer({
      fileName: utils.assetsPath('css/theme-colors.css'),
      matchColors: [
        ...forElementUI.getElementUISeries(primaryColor), // element-ui 主题色
        primaryColor // 自定义主题色
      ],
      changeSelector: forElementUI.changeSelector
    })
  ],
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
};
