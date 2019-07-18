<script>
export default {
  name: 'Redirect',
  beforeCreate() {
    const {
      params: { path },
      query
    } = this.$route;
    this.$router.replace({ path: '/' + path, query });
  },
  render() {
    return null;
  }
};
</script>
