/*
 * @Author: 焦质晔
 * @Date: 2020-05-25 08:34:03
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-29 16:38:40
 */
export default {
  computed: {
    currentSize() {
      return this.size || (this.$VDESIGN || {}).size || 'default';
    }
  }
};
