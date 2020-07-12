/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-08 18:29:53
 */
import axios from 'axios';
import qs from 'qs';
import config from '@/config/serverMap';
import store from '@/store';
import { getToken } from '@/utils/cookies';
import { notifyAction } from '@/utils';
import i18n from '@/lang';

// 请求异常提示信息
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  412: '客户端请求信息的先决条件错误。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
};

// 自定义扩展 header 请求头
const getConfigHeaders = () => {
  return {
    jwt: getToken() || '', // token
    Authorization: getToken() || '', // token
    lang: store.state.app.lang, // 多语言
    userAgent: 'pc', // 设备
    appId: 'JDMC'
  };
};

// 创建 axios 实例
const instance = axios.create({
  baseURL: config.host,
  timeout: 1000 * 20,
  withCredentials: true // 跨域请求时是否需要使用凭证
  // paramsSerializer: params => {
  //   // 序列化 GET 请求参数 -> a: [1, 2] => a=1&a=2
  //   return qs.stringify(params, { arrayFormat: 'repeat' });
  // }
});

// 异常处理程序
const errorHandler = error => {
  const { response = {} } = error;
  const errortext = codeMessage[response.status] || response.statusText || i18n.t('fetch.default');
  notifyAction(errortext, 'error');
  return Promise.reject(error);
};

// 请求拦截
instance.interceptors.request.use(config => {
  // 请求头信息，token 验证
  config.headers = {
    ...config.headers,
    ...getConfigHeaders()
  };
  return config;
}, errorHandler);

// 响应拦截
instance.interceptors.response.use(response => {
  let { config, headers, data } = response;
  // 请求异常提示信息
  if (data.code !== 200) {
    // token 过期，需要重新登录
    if (data.code === 40105) {
      store.dispatch('app/createLogout');
    }
    data.msg && notifyAction(data.msg, 'error');
  }
  // 判断是否为导出/下载
  if (config.responseType === 'blob') {
    return { headers, data };
  }
  return data;
}, errorHandler);

export { getConfigHeaders };
export default instance;
