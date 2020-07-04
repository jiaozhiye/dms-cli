/*
 * @Author: 焦质晔
 * @Date: 2020-05-25 08:34:03
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-25 09:17:04
 */
export default {
  computed: {
    prefixCls() {
      return (this.$VDESIGN || {}).prefixCls || 'v';
    }
  },
  methods: {
    getPrefixCls(suffixCls) {
      return `${this.prefixCls}-${suffixCls}`;
    }
  }
};
