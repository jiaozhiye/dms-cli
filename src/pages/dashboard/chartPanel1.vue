<template>
  <div class="wrapper">
    <div class="topper">
      <span class="title">用户通知</span>
    </div>
    <div>
      <Chart1
        :fetchapi="fetchApi"
        :params="fetchParams"
        :containerStyle="{ minHeight: 'auto', height: '210px' }"
      />
    </div>
  </div>
</template>

<script>
import Chart1 from '@/charts/dashboard/chart3';

export default {
  name: '',
  components: {
    Chart1
  },
  data() {
    return {
      fetchApi: () => {},
      fetchParams: {}
    };
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  width: 100%;
  height: 260px;
  margin-top: 15px;
  background-color: #fff;
  border-radius: @borderRadius;
  box-shadow: @boxShadow;
  .topper {
    display: flex;
    height: 46px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid @borderColor;
    .title {
      padding-left: 15px;
    }
  }
}
</style>
