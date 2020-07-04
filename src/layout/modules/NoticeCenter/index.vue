<template>
  <div class="notice-center">
    <el-popover v-model="visible" trigger="click" placement="bottom-end" transition="el-zoom-in-top">
      <el-badge slot="reference" :value="3" class="badge">
        <i class="icon el-icon-message-solid" />
      </el-badge>
      <InsideLetter v-if="visible" />
    </el-popover>
  </div>
</template>

<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-06-28 19:39:55
 **/
import InsideLetter from '@/pages/insideLetter/index';

export default {
  name: 'NoticeCenter',
  components: {
    InsideLetter
  },
  data() {
    return {
      visible: false
    };
  }
};
</script>

<style lang="scss" scoped>
.notice-center {
  display: flex;
  width: 26px;
  height: 26px;
  align-items: center;
  justify-content: center;
  .badge {
    /deep/ .el-badge__content {
      right: 10px;
      top: 2px;
      transform: translateY(-50%) translateX(100%) scale(0.9);
    }
  }
  .icon {
    font-size: 22px;
    cursor: pointer;
  }
}
</style>
