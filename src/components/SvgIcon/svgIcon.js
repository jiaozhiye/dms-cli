/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-25 13:48:35
 **/
import PropTypes from '../_utils/vue-types';

export default {
  name: 'SvgIcon',
  props: {
    iconClass: PropTypes.string.isRequired,
    className: PropTypes.string.def('')
  },
  computed: {
    iconName() {
      return `#icon-${this.iconClass}`;
    },
    svgClass() {
      return [
        `v-svg-icon`,
        {
          [`${this.className}`]: this.className
        }
      ];
    }
  },
  render() {
    const svgProps = {
      class: this.svgClass,
      on: {
        ...this.$listeners
      }
    };
    const useProps = {
      attrs: {
        'xlink:href': this.iconName
      }
    };
    return (
      <svg {...svgProps}>
        <use {...useProps} />
      </svg>
    );
  }
};
