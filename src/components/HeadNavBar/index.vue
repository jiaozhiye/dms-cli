<template>
  <div class="actions">
    <ScreenFull />
    <NoticePanel />
    <PersonalCenter />
  </div>
</template>

<script>
import { getUser, removeToken, removeUser } from '@/assets/js/auth';
import ScreenFull from '@/components/ScreenFull';
import NoticePanel from './NoticePanel';
import PersonalCenter from './PersonalCenter';

export default {
  name: 'HeadNavBar',
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
  },
  components: {
    ScreenFull,
    NoticePanel,
    PersonalCenter
  }
};
</script>

<style lang="less" scoped>
.actions {
  height: 100%;
  margin-right: @moduleMargin;
  display: flex;
  align-items: center;
}
</style>
