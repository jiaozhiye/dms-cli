/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 10:00:00
 */
import axios from '@/api/fetch';
import * as types from './types';
import SERVER from '@/api/server';

// 登录
export const doLogin = params => axios.post('/login/do', params, { mark: types.LOGIN });
