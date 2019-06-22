<script>
export default {
  name: 'RouteView',
  computed: {
    key() {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : 'view-' + +new Date();
    }
  },
  render() {
    const {
      key,
      $route: { meta }
    } = this;
    const inKeep = (
      <keep-alive>
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