/*
 * @Author: 焦质晔
 * @Date: 2020-05-29 09:49:09
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-29 09:58:29
 */
import PropTypes from '../_utils/vue-types';

export default {
  name: 'AnchorItem',
  props: {
    containerStyle: PropTypes.object.def({})
  },
  render() {
    const { containerStyle, $attrs } = this;
    const wrapProps = {
      attrs: $attrs,
      style: {
        ...containerStyle
      }
    };
    return <div {...wrapProps}>{this.$slots['default']}</div>;
  }
};
