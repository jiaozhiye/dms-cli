/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 10:00:00
 */
const createProductEnv = env => {
  const result = { env, envText: `当前工程环境：${env}`, serverUrl: '/' };
  if (env === 'development') {
    result.serverUrl = 'http://127.0.0.1:8081';
  } else {
    console.log = console.warn = console.info = () => {};
    result.serverUrl = '/';
  }
  return result;
};

export default createProductEnv(process.env.NODE_ENV);
