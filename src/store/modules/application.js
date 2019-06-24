import _ from 'lodash';
import * as types from '../types';
import { setToken, removeToken, setUser, removeUser } from '@/assets/js/auth';
import dictData from '@/mock/dictData';
import { getNavList, getAllDict, getStarMenuList } from '@/api';

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

// 递归添加父节点
const addParentNode = list => {
  (function fn(arr, obj) {
    for (let i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i].children) && arr[i].children.length > 0) {
        let { title, key, icon } = arr[i];
        fn(arr[i].children, { title, key, icon });
      }
      if (typeof obj !== 'undefined') {
        arr[i].parent = obj;
      }
    }
  })(list);
  return list;
};

// state
const state = {
  loginInfo: {},
  navList: [],
  menuList: [],
  starMenuList: [],
  dict: {}, // 数据字典、筛选条件
  btnLoading: false, // 按钮的加载中状态
  isLeaveRemind: false, // true -> 开启提醒     false -> 关闭提醒
  keepAliveNames: []
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
  createLogout({ commit, state }, params) {
    removeToken();
    removeUser();
    commit({
      type: types.LOGOUT,
      data: null
    });
  },
  async createNavList({ commit, state }, params) {
    if (state.navList.length) return;
    let data = [];
    if (process.env.MOCK_DATA === 'true') {
      const res = require('@/mock/sideMenu').default;
      data = res;
    } else {
      const res = await getNavList();
      if (res.resultCode === 200) {
        data = res.data;
      }
    }
    commit({
      type: types.MENULIST,
      data: formateMenu(data)
    });
    commit({
      type: types.NAVLIST,
      data: addParentNode(data)
    });
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
    commit({
      type: types.STAR_MENU,
      data
    });
  },
  checkAuthority({ commit, state }, params) {
    if (!state.menuList.length) {
      return false;
    }
    return state.menuList.some(x => x.key === params);
  },
  setBtnLoading({ commit, state }, params) {
    commit({
      type: types.BUTTON_LOADING,
      data: params
    });
  },
  setLeaveRemind({ commit, state }, params) {
    commit({
      type: types.LEAVE_REMIND,
      data: params
    });
  },
  async createDictData({ commit, state }, params) {
    if (Object.keys(state.dict).length) return;
    let data = dictData;
    if (process.env.MOCK_DATA !== 'true') {
      const res = await getAllDict();
      if (res.resultCode === 200) {
        data = { ...data, ...res.data };
      }
    }
    commit({ type: types.DICT_DATA, data });
  },
  addKeepAliveNames({ commit, state }, params) {
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
  [types.MENULIST](state, { data }) {
    state.menuList = data;
  },
  [types.BUTTON_LOADING](state, { data }) {
    state.btnLoading = data;
  },
  [types.LEAVE_REMIND](state, { data }) {
    state.isLeaveRemind = data;
  },
  [types.DICT_DATA](state, { data }) {
    state.dict = data;
  },
  [types.ADD_CNAME](state, { data }) {
    state.keepAliveNames = _.uniqWith([...state.keepAliveNames, data], _.isEqual);
  },
  [types.DEL_CNAME](state, { data }) {
    state.keepAliveNames.splice(state.keepAliveNames.findIndex(x => x.key === data), 1);
  },
  [types.ADD_STAR_MENU](state, { data }) {
    state.starMenuList = _.uniqWith([...state.starMenuList, data], _.isEqual);
  },
  [types.DEL_STAR_MENU](state, { data }) {
    state.starMenuList.splice(state.starMenuList.findIndex(x => x.key === data), 1);
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
