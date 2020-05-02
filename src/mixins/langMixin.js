/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-02 16:13:00
 */
export const language = {
  beforeCreate() {
    this.$lang = this.$store.state.app.lang;
  }
};
