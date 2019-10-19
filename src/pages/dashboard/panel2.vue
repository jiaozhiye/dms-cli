<template>
  <div>{{ Object.keys(users).join(',') }}</div>
</template>

<script>
export default {
  name: 'Panel2',
  props: {
    users: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {};
  },
  mounted() {
    console.log('mounted');
  }
};
</script>

<style scoped lang="less">
</style>
