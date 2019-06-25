<script>
import { mapState } from 'vuex';
import config from '@/config';
export default {
  name: 'RouteView',
  computed: {
    ...mapState('app', ['keepAliveNames']),
    key() {
      return this.$route.path;
    }
  },
  render() {
    const {
      key,
      keepAliveNames,
      $route: { meta }
    } = this;
    const inKeep = (
      <keep-alive max={config.maxCacheNum} include={keepAliveNames.map(x => x.value)}>
        <router-view />
      </keep-alive>
    );
    const notKeep = <router-view key={key} />;
    return meta.keepAlive ? inKeep : notKeep;
  }
};
</script>

<style lang="less" scoped>
</style>
