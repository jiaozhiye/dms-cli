/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-12-17 19:01:30
 */
'use strict';

const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.dev.conf');
const config = require('../config');

const HOST = process.env.HOST || config.dev.host;
const PORT = process.env.PORT || config.dev.port;

const compiler = Webpack(webpackConfig);
const devServerOptions = Object.assign({}, webpackConfig.devServer, { progress: true });
const server = new WebpackDevServer(compiler, devServerOptions);

server.listen(PORT, HOST, () => {
  console.log(`Starting server on http://${HOST}:${PORT}/`);
});
