<script>
export default {
  name: 'Redirect',
  beforeCreate() {
    const { params, query } = this.$route;
    const { path } = params;
    // refresh view
    this.$router.replace({ path: `/${path}`, query }).catch(() => {});
  },
  render(h) {
    return h();
  }
};
</script>
