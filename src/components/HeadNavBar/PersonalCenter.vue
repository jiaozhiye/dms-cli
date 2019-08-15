<template>
  <div class="setting">
    <el-dropdown trigger="click" class="el-dropdown">
      <span class="el-dropdown-link">
        <span class="avatar">
          <img
            class="img"
            src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
          />
        </span>
        <span>{{ username }}</span>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>个人中心</el-dropdown-item>
        <el-dropdown-item @click.native="logoutHandle">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { getUser, removeToken, removeUser } from '@/assets/js/auth';

export default {
  name: 'PersonalCenter',
  data() {
    return {
      username: getUser()
    };
  },
  methods: {
    logoutHandle() {
      // 需要走后台推出接口
      // ...
      removeToken();
      removeUser();
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
      padding: 6px 0;
      font-size: @textSize;
      cursor: pointer;
      .avatar {
        display: inline-block;
        overflow: hidden;
        width: 24px;
        height: 24px;
        border-radius: @borderRadius;
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
