/*
 * @Author: 焦质晔
 * @Date: 2020-04-23 13:28:28
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-27 13:58:21
 */
const config = {
  dev: {
    host: '/'
  },
  tst: {
    host: '//tst.xxx.com'
  },
  uat: {
    host: '//uat.xxx.com'
  },
  pre: {
    host: '//pre.xxx.com'
  },
  prod: {
    host: '//xxx.com'
  }
};

export default config[process.env.ENV_CONFIG];
