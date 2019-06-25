import SvgIcon from './index.vue';

const req = require.context('./svg', false, /\.svg$/);
const requireAll = requireContext => requireContext.keys().map(requireContext);
requireAll(req);

export default {
  install(Vue) {
    Vue.component('SvgIcon', SvgIcon);
  }
};
