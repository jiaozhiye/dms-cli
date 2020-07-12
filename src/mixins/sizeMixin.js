/**
 * @Author: 焦质晔
 * @Date: 2020-05-25 08:34:03
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-07 20:45:17
 */
import store from '@/store';

export const size = {
  computed: {
    currentSize() {
      return store.state.app.size;
    }
  }
};
