/**
 * @Author: 焦质晔
 * @Date: 2019/6/20
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 15:45:00
 */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import app from './modules/application';

const store = new Vuex.Store({
  modules: {
    app
  }
});

export default store;
