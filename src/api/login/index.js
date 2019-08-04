/**
 * @Author: 焦质晔
 * @Date: 2019/6/20
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 15:45:00
 */
import axios from '@/api/fetch';
import * as types from './types';
import SERVER from '@/api/server';

// 登录
export const doLogin = params => axios.post('/login/do', params, { mark: types.LOGIN });
