/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-29 10:03:25
 **/
import './style/index.scss';
import Anchor from './anchor.js';
import AnchorItem from './anchorItem.js';

Anchor.install = Vue => {
  Vue.component(Anchor.name, Anchor);
  Vue.component(AnchorItem.name, AnchorItem);
};

export default Anchor;
export { Anchor, AnchorItem };
