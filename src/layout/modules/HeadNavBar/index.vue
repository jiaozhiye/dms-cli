<template>
  <div class="actions">
    <ScreenFull />
    <ThemePicker />
    <LangSelect />
    <NoticePanel />
    <UserCenter />
  </div>
</template>

<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-02 10:35:12
 **/
import ScreenFull from '../ScreenFull';
import ThemePicker from '../ThemePicker';
import LangSelect from '../LangSelect';
import NoticePanel from './noticePanel';
import UserCenter from '@/pages/userCenter/index';

export default {
  name: 'HeadNavBar',
  components: {
    ScreenFull,
    ThemePicker,
    LangSelect,
    NoticePanel,
    UserCenter
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.actions {
  height: 100%;
  margin-right: $moduleMargin;
  display: flex;
  align-items: center;
}
</style>
