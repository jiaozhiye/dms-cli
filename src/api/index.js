/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-02-26 18:05:15
 */
import axios from '@/api/fetch';
import SERVER from '@/api/server';

// 获取菜单
export const getNavList = params => axios.get(`${SERVER.DMS_BASEDATA}/api/test`, { params });

// 获取所有数据字典值
export const getAllDict = params => axios.get(`${SERVER.DMS_BASEDATA}/api/test`, { params });

// 获取收藏导航
export const getStarMenuList = params => axios.get(`${SERVER.DMS_BASEDATA}/api/test`, { params });

// 获取常用导航
export const getCommonMenuList = params => axios.get(`${SERVER.DMS_BASEDATA}/api/test`, { params });
