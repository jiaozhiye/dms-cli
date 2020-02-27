<template>
  <div class="actions">
    <ScreenFull />
    <NoticePanel />
    <UserCenter />
  </div>
</template>

<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-02-27 10:17:47
 **/
import ScreenFull from '@/components/ScreenFull';
import NoticePanel from './noticePanel';
import UserCenter from '@/pages/userCenter/index';

export default {
  name: 'HeadNavBar',
  components: {
    ScreenFull,
    NoticePanel,
    UserCenter
  },
  data() {
    return {};
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
