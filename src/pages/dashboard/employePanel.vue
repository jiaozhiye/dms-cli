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
        <span>2147</span>
        <i>项</i>
      </h4>
      <h5>待办事项</h5>
    </div>
    <div class="box bg2">
      <h4>
        <span>215</span>
        <i>项</i>
      </h4>
      <h5>维修项目</h5>
    </div>
    <div class="box bg3">
      <h4>
        <span>28</span>
        <i>人</i>
      </h4>
      <h5>接待人数</h5>
    </div>
  </div>
</template>

<script>
import { language } from '@/mixins/langMixin';

export default {
  mixins: [language],
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  height: 90px;
  background-color: #fff;
  border-left: 4px solid $primaryColor;
  border-radius: $borderRadius;
  box-shadow: $boxShadow;
  align-items: center;
  overflow: hidden;
  .welcome {
    flex: 1;
    margin-left: 15px;
    display: flex;
    align-items: center;
    .avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      overflow: hidden;
      img {
        object-fit: cover;
        display: block;
        height: 100%;
      }
    }
    .info {
      flex: 1;
      min-width: 340px;
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
    min-width: 80px;
    border-radius: 6px;
    margin-right: 10px;
    padding: 6px 10px;
    color: #fff;
    h4 {
      font-size: 20px;
      border-bottom: 1px solid #fff;
      padding-bottom: 5px;
      i {
        font-size: 12px;
      }
    }
    h5 {
      padding-top: 5px;
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
