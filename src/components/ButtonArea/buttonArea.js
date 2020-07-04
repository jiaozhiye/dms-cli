/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-25 11:50:37
 **/
import PropTypes from '../_utils/vue-types';
import PrefixCls from '../_utils/mixins/prefix-cls';

export default {
  name: 'ButtonArea',
  mixins: [PrefixCls],
  props: {
    align: PropTypes.string.def('left'),
    containerStyle: PropTypes.object.def({})
  },
  render() {
    const { align, containerStyle, $slots } = this;
    const prefixCls = this.getPrefixCls('btn-area--wrapper');
    const cls = {
      [prefixCls]: true,
      [`btn-align-${align}`]: true
    };
    return (
      <div class={cls} style={containerStyle}>
        {$slots['default']}
      </div>
    );
  }
};
