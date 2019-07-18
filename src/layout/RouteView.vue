<script>
import { mapState } from 'vuex';

export default {
  name: 'RouteView',
  computed: {
    ...mapState('app', ['keepAliveNames']),
    cachedViews() {
      return this.keepAliveNames.map(x => x.value);
    },
    key() {
      return this.$route.fullPath;
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
