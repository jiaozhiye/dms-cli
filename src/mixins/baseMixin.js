/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-02 15:40:55
 */
export const basic = {
  methods: {
    setState(state, callback) {
      const newState = typeof state === 'function' ? state(this.$data, this.$props) : state;
      Object.assign(this.$data, newState);
      this.$nextTick(() => {
        callback && callback();
      });
    }
  }
};
