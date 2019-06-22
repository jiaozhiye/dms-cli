const createProductEnv = env => {
  const result = {
    env: `当前工程环境：${env}`,
    serverUrl: '/'
  };
  if (env === 'development') {
    result.serverUrl = 'http://127.0.0.1:7001';
  } else {
    result.serverUrl = '/';
  }
  return result;
};

export default createProductEnv(process.env.NODE_ENV);
