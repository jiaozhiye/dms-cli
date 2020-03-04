<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-04 11:27:02
 */
import { mapState } from 'vuex';

export default {
  name: 'RouteView',
  computed: {
    ...mapState('app', ['keepAliveNames']),
    isKeepAlive() {
      const { meta = {} } = this.$route;
      return !!meta.keepAlive;
    },
    cachedNames() {
      return ['RouteView', ...this.keepAliveNames.map(x => x.value)];
    },
    key() {
      return this.$route.fullPath;
    }
  },
  render() {
    const { cachedNames, isKeepAlive, key } = this;
    return (
      <keep-alive include={cachedNames}>
        <router-view key={key} />
      </keep-alive>
    );
  }
};
</script>
