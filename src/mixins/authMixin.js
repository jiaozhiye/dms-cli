/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-02 16:06:40
 */
import { mapState } from 'vuex';

export const authority = {
  computed: {
    ...mapState('app', ['navList']),
    $auths() {
      const target = this.deepMapAuth(this.navList, this.$route.path) || {};
      return target.permission || [];
    }
  },
  methods: {
    deepMapAuth(arr, mark) {
      let res = null;
      for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i].children)) {
          res = this.deepMapAuth(arr[i].children, mark);
        }
        if (res) {
          return res;
        }
        if (arr[i].key === mark) {
          return arr[i];
        }
      }
      return res;
    }
  }
};
