<template>
  <div class="actions">
    <ScreenFull />
    <NoticePanel />
    <PersonalCenter />
  </div>
</template>

<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 10:00:00
 **/
import ScreenFull from '@/components/ScreenFull';
import NoticePanel from './NoticePanel';
import PersonalCenter from './PersonalCenter';

export default {
  name: 'HeadNavBar',
  components: {
    ScreenFull,
    NoticePanel,
    PersonalCenter
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
