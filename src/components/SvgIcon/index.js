/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-23 21:53:00
 */
import './style/index.scss';
import SvgIcon from './svgIcon.js';

const req = require.context('./svg', false, /\.svg$/);
const requireAll = requireContext => requireContext.keys().map(requireContext);
requireAll(req);

SvgIcon.install = Vue => {
  Vue.component(SvgIcon.name, SvgIcon);
};

export default SvgIcon;
export { SvgIcon };
