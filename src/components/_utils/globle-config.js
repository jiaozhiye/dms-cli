/*
 * @Author: 焦质晔
 * @Date: 2020-07-07 10:02:39
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-07 10:15:36
 */
import Vue from 'vue';

export const getConfig = key => {
  return Vue.prototype.$VDESIGN?.config?.[key];
};
