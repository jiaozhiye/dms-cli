<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-02-01 19:23:52
 */
import { mapState } from 'vuex';

export default {
  name: 'RouteView',
  computed: {
    ...mapState('app', ['keepAliveNames']),
    cachedViews() {
      return this.keepAliveNames.map(x => x.value);
    },
    key() {
      return this.$route.path;
    }
  },
  render() {
    return (
      <keep-alive include={this.cachedViews}>
        <router-view />
      </keep-alive>
    );
  }
};
</script>
