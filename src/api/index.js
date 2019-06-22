import axios from '@/api/fetch';
import config from '@/assets/js/config';

// 登录
export const doLogin = params => axios.post('/login/do', params);

// 获取菜单
export const getNavList = params => axios.get('/api/test', { params });

// 获取所有数据字典值
export const getAllDict = params => axios.get('/api/test', { params });
