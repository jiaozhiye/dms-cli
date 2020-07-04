/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-06-29 10:58:57
 */
import Cookies from 'js-cookie';

const TokenKey = 'jwt';

export const getToken = () => Cookies.get(TokenKey);

export const setToken = token => Cookies.set(TokenKey, token);

export const removeToken = () => Cookies.remove(TokenKey);

export const getUser = () => Cookies.get('username');

export const setUser = name => Cookies.set('username', name);

export const removeUser = () => Cookies.remove('username');

// ==========================

export const get_vDealerName = () => Cookies.get('vDealerName');

export const set_vDealerName = val => Cookies.set('vDealerName', val);

export const remove_vDealerName = () => Cookies.remove('vDealerName');
