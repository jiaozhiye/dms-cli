<template>
  <div class="wrapper">
    <div class="topper">
      <span class="title">收入概览</span>
    </div>
    <div>
      <Chart :fetchapi="fetchApi" :params="fetchParams" :container-style="{ minHeight: 'auto', height: '210px' }" />
    </div>
  </div>
</template>

<script>
import { language } from '@/mixins/langMixin';

import Chart from '@/charts/dashboard/chart3';

export default {
  components: {
    Chart
  },
  mixins: [language],
  data() {
    return {
      fetchApi: () => {},
      fetchParams: {}
    };
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 260px;
  margin-top: 15px;
  background-color: #fff;
  border-radius: $borderRadius;
  box-shadow: $boxShadow;
  .topper {
    display: flex;
    height: 46px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid $borderColor;
    .title {
      padding-left: 15px;
    }
  }
}
</style>
