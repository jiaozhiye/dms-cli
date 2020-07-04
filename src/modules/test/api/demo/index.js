/*
 * @Author: 焦质晔
 * @Date: 2020-05-17 09:33:10
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-17 09:42:08
 */
import axios from '@/api/fetch';
import SERVER from '../server';

export const demoApi01 = params => axios.get(`${SERVER.TEST}/xxx/xxx`, { params });

export const demoApi02 = params => axios.post(`${SERVER.TEST}/xxx/xxx`, params);
