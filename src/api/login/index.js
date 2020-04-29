/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-29 11:56:00
 */
import SERVER from '@/api';
import axios from '@/api/fetch';

// 执行登录
export const doLogin = params => axios.post(`${SERVER.EP_SYSTEM}/sysLogin/user/Login`, params);

// 获取菜单
export const getNavList = params => axios.post(`${SERVER.EP_SYSTEM}/sysLogin/user/getUserMenus`, { userID: '61bc8c9c-969a-435b-9d4c-edf24764e313' });

// 获取所有数据字典值
export const getAllDict = params => axios.post(`${SERVER.EP_SYSTEM}/sysLogin/user/getDictionary`, { ndid: '75E13001-0000-0000-0000-000000000000', customid: '7EDDAED5-DE1A-454C-A2C0-7D5A6C9BE163' });

// 获取收藏导航
export const getStarMenuList = params => axios.get(`${SERVER.EP_SYSTEM}/sysLogin/test`, { params });

// 获取常用导航
export const getCommonMenuList = params => axios.get(`${SERVER.EP_SYSTEM}/sysLogin/test`, { params });
