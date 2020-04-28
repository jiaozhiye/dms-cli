/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-28 10:50:16
 */
import SERVER from '@/api';
import axios from '@/api/fetch';

// 执行登录
export const doLogin = params => axios.get(`${SERVER.EP_SYSTEM}/test`, { params });

// 获取菜单
export const getNavList = params => axios.get(`${SERVER.EP_SYSTEM}/test`, { params });

// 获取所有数据字典值
export const getAllDict = params => axios.get(`${SERVER.EP_SYSTEM}/test`, { params });

// 获取收藏导航
export const getStarMenuList = params => axios.get(`${SERVER.EP_SYSTEM}/test`, { params });

// 获取常用导航
export const getCommonMenuList = params => axios.get(`${SERVER.EP_SYSTEM}/test`, { params });
