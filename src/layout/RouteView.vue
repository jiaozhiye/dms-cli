<script>
import { mapState } from 'vuex';
export default {
  name: 'RouteView',
  computed: {
    ...mapState('app', ['keepAliveNames']),
    key() {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : 'view-' + +new Date();
    }
  },
  render() {
    const {
      key,
      keepAliveNames,
      $route: { meta }
    } = this;
    const inKeep = (
      <keep-alive max={10} include={keepAliveNames}>
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