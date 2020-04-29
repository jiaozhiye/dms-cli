/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-29 15:47:04
 */
import _ from 'lodash';
import * as types from '../types';
import router from '@/routes';
import { setToken, setUser, removeToken } from '@/utils/cookies';
import variables from '@/assets/css/variables.scss';
import localDict from '@/utils/localDict';
import { getNavList, getAllDict, getStarMenuList, getCommonMenuList } from '@/api/login';

const deepMapRoutes = (arr, mark) => {
  let res = null;
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i].children)) {
      res = deepMapRoutes(arr[i].children, mark);
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

const flatMapMenus = list => {
  const res = [];
  list.forEach(x => {
    if (Array.isArray(x.children)) {
      res.push(...flatMapMenus(x.children));
    } else {
      res.push(x);
    }
  });
  return res;
};

const formateNavList = (list, routes) => {
  list.forEach(x => {
    if (Array.isArray(x.children)) {
      x.children.forEach(sub => (sub.parentKey = x.key));
      formateNavList(x.children, routes);
    }
    let target = deepMapRoutes(routes, x.key) || {};
    // 隐藏菜单
    target.hideInMenu && (x.hideInMenu = true);
  });
};

// state
const state = {
  loginInfo: {}, // 登录信息
  navList: [], // 导航菜单树
  menuList: [], // 可点击(三级)的子菜单列表
  starMenuList: [], // 收藏导航
  commonMenuList: [], // 常用导航
  tabMenuList: [], // 导航选项卡列表
  theme: variables.theme, // 主题色
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
    removeToken();
    commit({
      type: types.LOGOUT,
      data: {}
    });
    dispatch('clearNavList');
    router.push({ path: '/' }).catch(() => {});
  },
  async createNavList({ dispatch, commit, state }, params) {
    if (state.navList.length) return;
    let data = [];
    if (process.env.MOCK_DATA === 'true') {
      const res = require('@/mock/sideMenu').default;
      data = res;
    } else {
      try {
        const res = await getNavList();
        if (res.code === 200 && res.data.length) {
          data = res.data;
        } else {
          return dispatch('createLogout');
        }
      } catch (err) {
        return dispatch('createLogout');
      }
    }
    formateNavList(data, router.options.routes);
    commit({ type: types.NAVLIST, data });
    commit({ type: types.MENULIST, data: flatMapMenus(data) });
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
      if (res.code === 200) {
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
      if (res.code === 200) {
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
    let data = {};
    if (process.env.MOCK_DATA === 'true') {
      data = { ...localDict };
    } else {
      const res = await getAllDict();
      if (res.code === 200) {
        data = { ...localDict, ...res.data };
      }
    }
    // 数据字典本地存储
    localStorage.setItem('dict', JSON.stringify(data));
    // Vuex 状态存储
    commit({ type: types.DICT_DATA, data });
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
    setTimeout(() => router.replace({ path: `/redirect${path}`, query }).catch(() => {}));
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
    state.keepAliveNames = state.keepAliveNames.filter(x => x.key !== data);
  },
  [types.ADD_STAR_MENU](state, { data }) {
    state.starMenuList = _.uniqWith([...state.starMenuList, data], _.isEqual);
  },
  [types.DEL_STAR_MENU](state, { data }) {
    state.starMenuList = state.starMenuList.filter(x => x.key !== data);
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
