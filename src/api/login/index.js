/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-02-26 18:04:09
 */
import axios from '@/api/fetch';
import SERVER from '@/api/server';

// 登录
export const doLogin = params => axios.post(`${SERVER.DMS_BASEDATA}/login/do`, params);
