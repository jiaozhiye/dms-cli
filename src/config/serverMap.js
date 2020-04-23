/*
 * @Author: 焦质晔
 * @Date: 2020-04-23 13:28:28
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-23 13:32:03
 */
const serverConfig = {
  dev: {
    baseUrl: '/'
  },
  tst: {
    baseUrl: '//tst.xxx.com'
  },
  uat: {
    baseUrl: '//uat.xxx.com'
  },
  pre: {
    baseUrl: '//pre.xxx.com'
  },
  prod: {
    base: '//xxx.com'
  }
};

export default serverConfig[process.env.ENV_CONFIG];
