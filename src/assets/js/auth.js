/**
 * @Author: 焦质晔
 * @Date: 2019/6/20
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 15:45:00
 */
import Cookies from 'js-cookie';

const TokenKey = 'Admin-Token';

export const getToken = () => Cookies.get(TokenKey);

export const setToken = token => Cookies.set(TokenKey, token);

export const removeToken = () => Cookies.remove(TokenKey);

// 登录用户操作
export const getUser = () => Cookies.get('username');

export const setUser = name => Cookies.set('username', name);

export const removeUser = () => Cookies.remove('username');
