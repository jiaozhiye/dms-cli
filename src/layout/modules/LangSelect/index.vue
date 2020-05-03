<template>
  <el-dropdown class="lang-select" trigger="click" placement="bottom-start" @command="languageChangeHandle">
    <i class="iconfont icon-earth" />
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="lang === 'zh'" command="zh">
        中文
      </el-dropdown-item>
      <el-dropdown-item :disabled="lang === 'en'" command="en">
        English
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
/*
 * @Author: 焦质晔
 * @Date: 2020-04-30 15:17:48
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-03 11:34:02
 */
import { mapState, mapActions } from 'vuex';

export default {
  name: 'LangSelect',
  computed: {
    ...mapState('app', ['lang'])
  },
  methods: {
    ...mapActions('app', ['setLanguage']),
    languageChangeHandle(lang) {
      this.$i18n.locale = lang;
      this.setLanguage(lang);
      localStorage.setItem('lang', lang);
      // 浏览器刷新，重新获取数据
      // ...
      // 可能需要重新获取基础信息
      // ...
    }
  }
};
</script>

<style lang="scss" scoped>
.lang-select {
  margin-left: 4px;
  .icon-earth {
    display: inline-block;
    padding: 5px 0 5px 3px;
    font-size: 20px;
    cursor: pointer;
  }
}
</style>
