<template>
  <div class="dashboard">
    <div class="left">
      <EmployeInfo />
    </div>
    <div class="right"></div>
  </div>
</template>

<script>
import EmployeInfo from './employeInfo.vue';

export default {
  name: 'Dashboard',
  components: {
    EmployeInfo
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped lang="less">
.dashboard {
  display: flex;
  height: calc(100vh - 100px);
  .left {
    flex: 1;
    margin-right: @moduleMargin;
  }
  .right {
    width: 40%;
  }
}
</style>
