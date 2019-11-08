<template>
  <div class="notice-panel">
    <el-popover
      v-model="visible"
      trigger="click"
      placement="bottom-end"
      transition="el-zoom-in-top"
    >
      <el-badge slot="reference" :value="3" class="badge">
        <i class="icon el-icon-message-solid"></i>
      </el-badge>
      <keep-alive>
        <Notice v-if="visible" />
      </keep-alive>
    </el-popover>
  </div>
</template>

<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 10:00:00
 **/
import Notice from '@/pages/notice/index';

export default {
  name: 'NoticePanel',
  data() {
    return {
      visible: false
    };
  },
  components: {
    Notice
  }
};
</script>

<style lang="less" scoped>
.notice-panel {
  .badge {
    /deep/ .el-badge__content {
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
