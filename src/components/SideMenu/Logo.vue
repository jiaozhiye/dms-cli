<template>
  <div class="logo">
    <router-link to="/" :title="title">
      <img src="@/assets/img/logo.png" alt="logo" :style="{ width: collapsed ? '35px' : '70px' }" />
      <h1 v-if="!collapsed">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Logo',
  props: {
    title: {
      type: String,
      default: ''
    },
    collapsed: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="less" scoped>
.logo {
  height: 60px;
  line-height: 60px;
  padding-left: 15px;
  transition: all 0.3s ease;
  background-color: @logoBgColor;
  overflow: hidden;
  img {
    display: inline-block;
    vertical-align: middle;
    margin: -2px 5px 0 0;
    transition: all 0.3s ease;
  }
  h1 {
    display: inline-block;
    color: #fff;
    font-size: @textSize;
    font-weight: normal;
  }
}
</style>
