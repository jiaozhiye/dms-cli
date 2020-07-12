/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-29 09:37:44
 **/
import PropTypes from '../_utils/vue-types';
import Size from '../_utils/mixins/size';
import PrefixCls from '../_utils/mixins/prefix-cls';

export default {
  name: 'BreakSpace',
  mixins: [Size, PrefixCls],
  props: {
    label: PropTypes.string.def(''),
    size: PropTypes.oneOf(['small', 'default', 'large']),
    containerStyle: PropTypes.object.def({}),
    labelStyle: PropTypes.object.def({})
  },
  render() {
    const prefixCls = this.getPrefixCls('form-panel--divider');
    const cls = {
      [prefixCls]: true,
      [`${prefixCls}-sm`]: this.currentSize === 'small',
      [`${prefixCls}-lg`]: this.currentSize === 'large'
    };
    const { containerStyle, labelStyle, label, $attrs } = this;
    const wrapProps = {
      attrs: $attrs,
      style: {
        ...containerStyle
      }
    };
    return (
      <div class={cls} {...wrapProps}>
        <el-divider contentPosition="left">
          <span class="title" style={{ ...labelStyle }}>
            {label}
          </span>
        </el-divider>
      </div>
    );
  }
};
