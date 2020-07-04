<template>
  <el-color-picker
    v-model="theme"
    class="theme-picker"
    popper-class="theme-picker-dropdown"
    :predefine="['#0d74b5', '#1890ff', '#001e50', '#722ed1', '#11a983', '#13c2c2', '#52c41a', '#f5222d', '#fa541c', '#faad14']"
    @change="changeThemeColor"
  />
</template>

<script>
/*
 * @Author: 焦质晔
 * @Date: 2020-04-23 19:44:29
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-17 16:56:33
 */
import { mapState, mapActions } from 'vuex';

export default {
  name: 'ThemePicker',
  data() {
    return {
      theme: localStorage.getItem('theme') || this.$store.state.app.theme
    };
  },
  methods: {
    ...mapActions('app', ['emitThemeColor', 'createThemeColor']),
    changeThemeColor(newColor) {
      this.emitThemeColor(newColor);
      this.createThemeColor(newColor);
    }
  }
};
</script>

<style lang="scss">
.theme-picker {
  width: 26px;
  height: 26px;
  .el-color-picker__trigger {
    height: 100%;
    width: 100%;
    border: 0;
  }
}
.theme-picker-dropdown {
  margin-top: 10px;
  margin-left: -230px;
  .el-color-dropdown__link-btn {
    display: none;
  }
}
</style>
