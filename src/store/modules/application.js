/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-02-26 18:20:37
 */
import _ from 'lodash';
import * as types from '../types';
import router from '@/routes';
import { messageAction, clearAllCookie } from '@/utils';
import { setToken, setUser } from '@/assets/js/auth';
import dictData from '@/mock/dictData';
import { getNavList, getAllDict, getStarMenuList, getCommonMenuList } from '@/api';

// 路由映射表
const routesMap = router.options.routes;

// 数组的递归查找
const deepFind = (arr, mark) => {
  let res = null;
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i].children)) {
      res = deepFind(arr[i].children, mark);
    }
    if (res) {
      return res;
    }
    if (arr[i].path === mark) {
      return arr[i];
    }
  }
  return res;
};

// 给导航数据添加图标属性
const formateNavList = list => {
  list.forEach(x => {
    if (Array.isArray(x.children)) {
      formateNavList(x.children);
    }
    let target = deepFind(routesMap, x.key) || {};
    // 图标
    target.meta && (x.icon = target.meta.icon);
    // 隐藏菜单
    target.hideInMenu && (x.hideInMenu = true);
  });
};

// 提取可点击的菜单项
const formateMenu = list => {
  const res = [];
  list.forEach(x => {
    if (Array.isArray(x.children)) {
      res.push(...formateMenu(x.children));
    } else {
      res.push(x);
    }
  });
  return res;
};

// state
const state = {
  loginInfo: {}, // 登录信息
  navList: [], // 导航菜单树
  menuList: [], // 可点击(三级)的子菜单列表
  starMenuList: [], // 收藏导航
  commonMenuList: [], // 常用导航
  tabMenuList: [], // 导航选项卡列表
  dict: {}, // 数据字典、筛选条件
  keepAliveNames: [], // 路由组件缓存列表
  isNotifyMark: false // 页面中是否已存在消息通知组件
};

// actions
const actions = {
  createLoginInfo({ commit, state }, params) {
    setToken(params.token);
    setUser(params.name);
    commit({
      type: types.LOGININFO,
      data: params
    });
  },
  createLogout({ dispatch, commit, state }, params) {
    clearAllCookie();
    commit({
      type: types.LOGOUT,
      data: {}
    });
    dispatch('clearNavList');
  },
  async createNavList({ dispatch, commit, state }, params) {
    if (state.navList.length) return;
    let data = [];
    if (process.env.MOCK_DATA === 'true') {
      const res = require('@/mock/sideMenu').default;
      data = res;
    } else {
      const res = await getNavList();
      if (res.resultCode === 200 && res.data.length) {
        data = res.data;
      } else {
        messageAction('系统菜单获取失败！', 'error');
        dispatch('createLogout');
        return router.push({ path: '/' }).catch(() => {});
      }
    }
    // 处理图标
    formateNavList(data);
    commit({ type: types.NAVLIST, data });
    commit({
      type: types.MENULIST,
      data: formateMenu(data)
    });
    return true;
  },
  clearNavList({ dispatch, commit, state }, params) {
    commit({
      type: types.NAVLIST,
      data: []
    });
    dispatch('clearTabMenuList');
  },
  async createStarMenuList({ commit, state }, params) {
    if (state.starMenuList.length) return;
    let data = [];
    if (process.env.MOCK_DATA === 'true') {
      const res = require('@/mock/starMenu').default;
      data = res;
    } else {
      const res = await getStarMenuList();
      if (res.resultCode === 200) {
        data = res.data;
      }
    }
    commit({ type: types.STAR_MENU, data });
  },
  async createCommonMenuList({ commit, state }, params) {
    if (state.commonMenuList.length) return;
    let data = [];
    if (process.env.MOCK_DATA === 'true') {
      const res = require('@/mock/starMenu').default;
      data = res;
    } else {
      const res = await getCommonMenuList();
      if (res.resultCode === 200) {
        data = res.data;
      }
    }
    commit({ type: types.COMMON_MENU, data });
  },
  createTabMenuList({ commit, state }, params) {
    commit({
      type: types.TAB_MENU,
      data: params
    });
  },
  clearTabMenuList({ commit, state }, params) {
    commit({
      type: types.TAB_MENU,
      data: []
    });
  },
  checkAuthority({ commit, state }, params) {
    if (!state.menuList.length) {
      return false;
    }
    return state.menuList.some(x => x.key === params);
  },
  async createDictData({ commit, state }, params) {
    if (Object.keys(state.dict).length) return;
    if (process.env.MOCK_DATA === 'true') {
      commit({ type: types.DICT_DATA, data: dictData });
    } else {
      const res = await getAllDict();
      if (res.resultCode === 200) {
        const data = { ...dictData, ...res.data };
        // 数据字典本地存储
        if (!_.isEqual(data, JSON.parse(localStorage.getItem('dict')))) {
          localStorage.setItem('dict', JSON.stringify(data));
        }
        // Vuex 状态存储
        commit({ type: types.DICT_DATA, data });
      }
    }
  },
  addKeepAliveNames({ commit, state }, params) {
    if (state.keepAliveNames.some(x => x.value === params.value)) return;
    commit({
      type: types.ADD_CNAME,
      data: params
    });
  },
  removeKeepAliveNames({ commit, state }, params) {
    commit({
      type: types.DEL_CNAME,
      data: params
    });
  },
  addStarMenuList({ commit, state }, params) {
    commit({
      type: types.ADD_STAR_MENU,
      data: params
    });
  },
  removeStarMenuList({ commit, state }, params) {
    commit({
      type: types.DEL_STAR_MENU,
      data: params
    });
  },
  refreshView({ commit, state }, { path, query = {} }) {
    commit({
      type: types.DEL_CNAME,
      data: path
    });
    router.replace({ path: `/redirect${path}`, query }).catch(() => {});
  },
  createNotifyState({ commit, state }, params) {
    commit({
      type: types.NOTIFY_STATE,
      data: params
    });
  }
};

// mutations
const mutations = {
  [types.LOGININFO](state, { data }) {
    state.loginInfo = data;
  },
  [types.LOGOUT](state, { data }) {
    state.loginInfo = data;
  },
  [types.NAVLIST](state, { data }) {
    state.navList = data;
  },
  [types.STAR_MENU](state, { data }) {
    state.starMenuList = data;
  },
  [types.COMMON_MENU](state, { data }) {
    state.commonMenuList = data;
  },
  [types.MENULIST](state, { data }) {
    state.menuList = data;
  },
  [types.TAB_MENU](state, { data }) {
    state.tabMenuList = data;
  },
  [types.DICT_DATA](state, { data }) {
    state.dict = data;
  },
  [types.ADD_CNAME](state, { data }) {
    state.keepAliveNames = [...state.keepAliveNames, data];
  },
  [types.DEL_CNAME](state, { data }) {
    state.keepAliveNames.splice(
      state.keepAliveNames.findIndex(x => x.key === data),
      1
    );
  },
  [types.ADD_STAR_MENU](state, { data }) {
    state.starMenuList = _.uniqWith([...state.starMenuList, data], _.isEqual);
  },
  [types.DEL_STAR_MENU](state, { data }) {
    state.starMenuList.splice(
      state.starMenuList.findIndex(x => x.key === data),
      1
    );
  },
  [types.NOTIFY_STATE](state, { data }) {
    state.isNotifyMark = data;
  }
};

// getters
const getters = {};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
