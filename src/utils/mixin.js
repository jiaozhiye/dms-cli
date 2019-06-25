/**
 * @Author: 焦质晔
 * @Date: 2019/6/20
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 15:45:00
 */
import { mapState } from 'vuex';

export const authority = {
  computed: {
    ...mapState('app', ['navList']),
    auths() {
      const target = this.deepFind(this.navList, this.$route.path);
      return target.permission || [];
    }
  },
  methods: {
    deepFind(arr, mark) {
      let res = null;
      for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i].children)) {
          res = this.deepFind(arr[i].children, mark);
        }
        if (res !== null) {
          return res;
        }
        if (arr[i].key === mark) {
          res = arr[i];
          break;
        }
      }
      return res;
    }
  }
};
