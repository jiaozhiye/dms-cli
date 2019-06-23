import _ from 'lodash';
import * as types from '../types';
import { setToken, removeToken, setUser, removeUser } from '@/assets/js/auth';
import dictData from '@/mock/dictData';
import { getNavList, getAllDict } from '@/api';

// 递归添加父节点
const addParentNode = list => {
  (function func(arr, obj) {
    for (let i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i].children) && arr[i].children.length > 0) {
        let { title, key, icon } = arr[i];
        func(arr[i].children, { title, key, icon });
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
      type: types.NAVLIST,
      data: addParentNode(data)
    });
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
    commit({
      type: types.DICT_DATA,
      data
    });
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
