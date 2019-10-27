/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 10:00:00
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
