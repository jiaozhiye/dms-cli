/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-07 10:10:18
 */
import { mapState } from 'vuex';

export const authority = {
  computed: {
    ...mapState('app', ['navList']),
    auths() {
      const target = this.deepAuthFind(this.navList, this.$route.path) || {};
      return target.permission || [];
    }
  },
  methods: {
    deepAuthFind(arr, mark) {
      let res = null;
      for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i].children)) {
          res = this.deepAuthFind(arr[i].children, mark);
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
