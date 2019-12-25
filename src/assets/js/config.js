/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-12-25 09:17:28
 */
const createProductEnv = env => {
  const result = { env, envText: `当前工程环境：${env}`, serverUrl: '/' };
  if (env === 'development') {
    result.serverUrl = 'http://localhost:8081';
  } else {
    console.log = console.warn = console.info = () => {};
    result.serverUrl = '/';
  }
  return result;
};

export default createProductEnv(process.env.NODE_ENV);
