<template>
  <div class="spinner-wrap">
    <div class="box">
      <i class="el-icon-loading"></i>
      <p class="text">拼命加载中</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RouteLoading'
};
</script>

<style lang="less" scoped>
.spinner-wrap {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  .box {
    text-align: center;
    .el-icon-loading {
      font-size: 26px;
    }
    .text {
      margin-top: 8px;
      color: #666;
      font-size: 12px;
    }
  }
}
</style>
