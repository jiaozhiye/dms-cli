<template>
  <div class="actions">
    <ScreenFull />
    <NoticePanel />
    <PersonalCenter />
  </div>
</template>

<script>
import ScreenFull from '@/components/ScreenFull';
import NoticePanel from './NoticePanel';
import PersonalCenter from './PersonalCenter';

export default {
  name: 'HeadNavBar',
  data() {
    return {};
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
