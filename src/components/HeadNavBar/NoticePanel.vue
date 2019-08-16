<template>
  <div class="notice-panel">
    <el-popover trigger="click" placement="bottom-end">
      <el-badge slot="reference" :value="3" class="badge">
        <i class="icon el-icon-message-solid"></i>
      </el-badge>
      <Notice />
    </el-popover>
  </div>
</template>

<script>
import Notice from '@/pages/notice/index';

export default {
  name: 'NoticePanel',
  data() {
    return {};
  },
  components: {
    Notice
  }
};
</script>

<style lang="less">
.notice-panel {
  .badge {
    .el-badge__content {
      right: 15px;
      top: 5px;
      transform: translateY(-50%) translateX(100%) scale(0.9);
    }
  }
  .icon {
    font-size: 24px;
    padding: 5px;
    cursor: pointer;
  }
}
</style>
