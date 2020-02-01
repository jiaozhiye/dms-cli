<script>
export default {
  name: 'Redirect',
  beforeCreate() {
    const {
      params: { path },
      query
    } = this.$route;
    // refresh view
    this.$router.replace({ path: `/${path}`, query }).catch(() => {});
  },
  render() {
    return null;
  }
};
</script>
