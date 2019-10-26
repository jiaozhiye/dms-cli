<template>
  <div class="wrapper">
    <div class="topper">
      <span class="title">备件统计</span>
    </div>
  </div>
</template>

<script>
export default {
  name: ''
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
