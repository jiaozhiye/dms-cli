<template>
  <el-color-picker
    v-model="theme"
    class="theme-picker"
    popper-class="theme-picker-dropdown"
    :predefine="['#1890ff', '#2f54eb', '#722ed1', '#11a983', '#13c2c2', '#52c41a', '#304156', '#f5222d', '#fa541c', '#faad14']"
    @change="changeThemeColor"
  />
</template>

<script>
/*
 * @Author: 焦质晔
 * @Date: 2020-04-23 19:44:29
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-25 20:05:29
 */
import client from 'webpack-theme-color-replacer/client';
import forElementUI from 'webpack-theme-color-replacer/forElementUI';

const savedColor = localStorage.getItem('theme_color');

export default {
  name: 'ThemePicker',
  data() {
    this.defaultTheme = this.$store.state.app.theme;
    return {
      theme: savedColor || this.defaultTheme
    };
  },
  mounted() {
    this.initThemeColor();
  },
  methods: {
    initThemeColor() {
      if (savedColor && savedColor !== this.defaultTheme) {
        this.changeThemeColor(savedColor);
      }
    },
    changeThemeColor(newColor) {
      const options = {
        newColors: [...forElementUI.getElementUISeries(newColor), newColor],
        changeUrl: cssUrl => {
          // 当 router 不是 hash mode 时，它需要将 url 更改为绝对路径(以 / 开头)
          return `/${cssUrl}`;
        }
      };
      return client.changer.changeColor(options, Promise).then(x => {
        localStorage.setItem('theme_color', newColor);
      });
    }
  }
};
</script>

<style lang="scss">
.theme-picker {
  height: 30px;
  margin-left: 4px;
  .el-color-picker__trigger {
    height: 30px;
    width: 30px;
    border-radius: $borderRadius;
  }
}
.theme-picker-dropdown {
  margin-top: 5px;
  margin-left: -230px;
  .el-color-dropdown__link-btn {
    display: none;
  }
}
</style>
