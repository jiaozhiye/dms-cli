/**
 * @Author: 焦质晔
 * @Date: 2019/6/20
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 15:45:00
 */
import axios from '@/api/fetch';
import SERVER from '@/api/server';

// 获取菜单
export const getNavList = params => axios.get('/api/test', { params });

// 获取所有数据字典值
export const getAllDict = params => axios.get('/api/test', { params });

// 获取收藏导航
export const getStarMenuList = params => axios.get('/api/test', { params });

// 获取常用导航
export const getCommonMenuList = params => axios.get('/api/test', { params });
