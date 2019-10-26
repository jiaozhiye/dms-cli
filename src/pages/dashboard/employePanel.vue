<template>
  <div class="worker">
    <div class="welcome">
      <h3>
        Welcome Back,
        <span>张三</span>
      </h3>
      <h5>您上次登录时间：2012-12-12 10:10:10</h5>
    </div>
    <div class="box bg1">
      <h4>
        <CountUp :endVal="2147" />
        <i>项</i>
      </h4>
      <h5>待办事项</h5>
    </div>
    <div class="box bg2">
      <h4>
        <CountUp :endVal="215" />
        <i>项</i>
      </h4>
      <h5>维修项目</h5>
    </div>
    <div class="box bg3">
      <h4>
        <CountUp :endVal="28" />
        <i>人</i>
      </h4>
      <h5>接待人数</h5>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
.worker {
  display: flex;
  height: 90px;
  background-color: #fff;
  border-left: 3px solid @primaryColor;
  border-radius: @borderRadius;
  box-shadow: @boxShadow;
  align-items: center;
  .welcome {
    flex: 1;
    margin: 20px;
    h3 {
      font-weight: 700;
      font-size: 16px;
    }
    h5 {
      padding-top: 10px;
      font-size: 12px;
    }
  }
  .box {
    width: 80px;
    border-radius: 6px;
    margin-right: 20px;
    padding: 10px;
    color: #fff;
    user-select: none;
    h4 {
      font-size: 20px;
      border-bottom: 1px solid #fff;
      padding-bottom: 5px;
      i {
        font-size: 12px;
      }
    }
    h5 {
      padding-top: 6px;
      font-size: 12px;
    }
  }
  .bg1 {
    background-color: #bb0a30;
  }
  .bg2 {
    background-color: #474747;
  }
  .bg3 {
    background-color: #0f9271;
  }
}
</style>
