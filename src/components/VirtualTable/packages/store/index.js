/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-24 15:18:17
 */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    required: [],
    validate: []
  },
  actions: {
    addToRequired({ commit, state }, params) {
      commit({
        type: `ADD_REQUIRED`,
        data: params
      });
    },
    removeFromRequired({ commit, state }, params) {
      commit({
        type: `REMOVE_REQUIRED`,
        data: params
      });
    },
    addToValidate({ commit, state }, params) {
      commit({
        type: `ADD_VALIDATE`,
        data: params
      });
    },
    removeFromValidate({ commit, state }, params) {
      commit({
        type: `REMOVE_VALIDATE`,
        data: params
      });
    }
  },
  mutations: {
    [`ADD_REQUIRED`](state, { data }) {
      const index = state.required.findIndex(item => item.x === data.x && item.y === data.y);
      if (index !== -1) return;
      state.required.push(data);
    },
    [`REMOVE_REQUIRED`](state, { data }) {
      const index = state.required.findIndex(item => item.x === data.x && item.y === data.y);
      if (index < 0) return;
      state.required.splice(index, 1);
    },
    [`ADD_VALIDATE`](state, { data }) {
      const index = state.validate.findIndex(item => item.x === data.x && item.y === data.y);
      if (index !== -1) return;
      state.validate.push(data);
    },
    [`REMOVE_VALIDATE`](state, { data }) {
      const index = state.validate.findIndex(item => item.x === data.x && item.y === data.y);
      if (index < 0) return;
      state.validate.splice(index, 1);
    }
  }
});

export default store;
