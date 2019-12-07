<template>
  <div class="setting">
    <el-dropdown trigger="click" class="el-dropdown">
      <span class="el-dropdown-link">
        <span class="avatar">
          <img class="img" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" />
        </span>
        <span>{{ username }}</span>
        <i class="el-icon-arrow-down el-icon--right" />
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-setting">个人中心</el-dropdown-item>
        <el-dropdown-item icon="el-icon-switch-button" divided @click.native="logoutHandle">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-12-07 20:29:52
 **/
import { mapActions } from 'vuex';
import { getUser } from '@/assets/js/auth';

export default {
  name: 'PersonalCenter',
  data() {
    return {
      username: getUser()
    };
  },
  methods: {
    ...mapActions('app', ['createLogout']),
    logoutHandle() {
      // 需要走后台推出接口
      this.createLogout();
      this.$router.push({ path: '/login' });
    }
  }
};
</script>

<style lang="less" scoped>
.setting {
  margin-left: 15px;
  .el-dropdown {
    .el-dropdown-link {
      display: inline-block;
      padding: 5px 0;
      font-size: @textSize;
      cursor: pointer;
      .avatar {
        display: inline-block;
        overflow: hidden;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        vertical-align: middle;
        .img {
          object-fit: cover;
          display: block;
          height: 100%;
        }
      }
    }
  }
}
</style>
