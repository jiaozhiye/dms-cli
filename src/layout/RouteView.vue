<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-02-26 10:06:44
 */
import { mapState } from 'vuex';

export default {
  name: 'RouteView',
  computed: {
    ...mapState('app', ['keepAliveNames']),
    cachedViews() {
      return this.keepAliveNames.map(x => x.value);
    },
    isKeepAlive() {
      const { meta = {} } = this.$route;
      return !!meta.keepAlive;
    },
    key() {
      return this.$route.fullPath;
    }
  },
  render() {
    const { cachedViews, isKeepAlive, key } = this;
    const props = !isKeepAlive ? { key } : null;
    return (
      <keep-alive include={cachedViews}>
        <router-view {...props} />
      </keep-alive>
    );
  }
};
</script>
