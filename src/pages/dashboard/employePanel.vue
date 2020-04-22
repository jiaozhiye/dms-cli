<template>
  <div class="wrapper">
    <div class="welcome">
      <div class="avatar">
        <img src="@/assets/img/avatar.jpg" />
      </div>
      <div class="info">
        <h3>
          Welcome Back
          <span>张三</span>
          ，祝你开心每一天！
        </h3>
        <h5>您上次登录时间：2012-12-12 10:10:10</h5>
      </div>
    </div>
    <div class="box bg1">
      <h4>
        <CountUp :end-val="2147" />
        <i>项</i>
      </h4>
      <h5>待办事项</h5>
    </div>
    <div class="box bg2">
      <h4>
        <CountUp :end-val="215" />
        <i>项</i>
      </h4>
      <h5>维修项目</h5>
    </div>
    <div class="box bg3">
      <h4>
        <CountUp :end-val="28" />
        <i>人</i>
      </h4>
      <h5>接待人数</h5>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  display: flex;
  height: 90px;
  background-color: #fff;
  border-left: 4px solid @primaryColor;
  border-radius: @borderRadius;
  box-shadow: @boxShadow;
  align-items: center;
  .welcome {
    flex: 1;
    margin-left: 15px;
    display: flex;
    align-items: center;
    .avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      vertical-align: middle;
      overflow: hidden;
      img {
        object-fit: cover;
        display: block;
        height: 100%;
      }
    }
    .info {
      flex: 1;
      margin-left: 15px;
      h3 {
        font-weight: 700;
        font-size: 16px;
      }
      h5 {
        padding-top: 10px;
        font-size: 12px;
      }
    }
  }
  .box {
    width: 80px;
    border-radius: 6px;
    margin-right: 15px;
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
