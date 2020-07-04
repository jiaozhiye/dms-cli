<template>
  <div class="setting">
    <el-dropdown trigger="click" class="el-dropdown">
      <span class="el-dropdown-link">
        <span class="avatar fl">
          <img class="img" src="@/assets/img/avatar.jpg" />
        </span>
        <span class="text text_overflow_cut fl">{{ username }}</span>
        <i class="el-icon-arrow-down el-icon--right" />
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-setting">{{ $t('settings.usercenter') }}</el-dropdown-item>
        <el-dropdown-item icon="el-icon-switch-button" divided @click.native="logoutHandle">{{ $t('settings.logout') }}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-18 08:13:24
 **/
import { mapActions } from 'vuex';
import { getUser } from '@/utils/cookies';

export default {
  name: 'UserCenter',
  data() {
    return {
      username: getUser() || '管理员'
    };
  },
  methods: {
    ...mapActions('app', ['createLogout']),
    logoutHandle() {
      // 需要走后台推出接口
      this.createLogout();
    }
  }
};
</script>

<style lang="scss" scoped>
.setting {
  margin-left: 10px;
  .el-dropdown {
    .el-dropdown-link {
      font-size: $textSize;
      line-height: 24px;
      cursor: pointer;
      .avatar {
        overflow: hidden;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        margin-right: 4px;
        .img {
          object-fit: cover;
          display: block;
          height: 100%;
        }
      }
      .text {
        max-width: 70px;
      }
    }
  }
}
</style>
