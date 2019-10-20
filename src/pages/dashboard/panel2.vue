<template>
  <div>
    <h5>{{ Object.keys(users).join(',') }}</h5>
    <div>
      <Chart1 :fetchapi="fetchApi" :params="fetchParams" />
    </div>
  </div>
</template>

<script>
import Chart1 from '@/charts/dashboard/chart1';

export default {
  name: 'Panel2',
  components: {
    Chart1
  },
  props: {
    users: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      fetchApi: () => {},
      fetchParams: {}
    };
  },
  mounted() {
    console.log('mounted');
  }
};
</script>

<style scoped lang="less">
</style>
