<template>
  <el-dropdown class="size-select" trigger="click" placement="bottom-start" @command="languageChangeHandle">
    <i class="iconfont icon-font-size" />
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="size === 'large'" command="large">
        {{ $t('sizeSelect.large') }}
      </el-dropdown-item>
      <el-dropdown-item :disabled="size === 'default'" command="default">
        {{ $t('sizeSelect.default') }}
      </el-dropdown-item>
      <el-dropdown-item :disabled="size === 'small'" command="small">
        {{ $t('sizeSelect.small') }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
/*
 * @Author: 焦质晔
 * @Date: 2020-04-30 15:17:48
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-08 17:28:28
 */
import { mapState, mapActions } from 'vuex';
import Vue from 'vue';

export default {
  name: 'SizeSelect',
  computed: {
    ...mapState('app', ['size'])
  },
  methods: {
    ...mapActions('app', ['setSize', 'createElementSize', 'refreshView']),
    languageChangeHandle(size) {
      this.setSize(size);
      this.createElementSize(size);
      localStorage.setItem('size', size);
      // 浏览器刷新，重新获取数据
      // window.history.go(0);
      this.refreshView({ path: this.$route.path });
      // 可能需要重新获取基础信息
      // ...
    }
  }
};
</script>

<style lang="scss" scoped>
.size-select {
  display: flex;
  width: 26px;
  height: 26px;
  align-items: center;
  justify-content: center;
  .icon-font-size {
    font-size: 20px;
    cursor: pointer;
  }
}
</style>
