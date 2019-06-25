<template>
  <div class="logo">
    <router-link to="/">
      <img src="@/assets/img/logo.png" alt="logo">
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
      default: 'DMS 系统'
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
  padding-left: 16px;
  transition: all 0.3s;
  background: #002140;
  overflow: hidden;
  img {
    height: 32px;
    display: inline-block;
    vertical-align: middle;
  }
  h1 {
    display: inline-block;
    color: #fff;
    font-size: 16px;
    font-weight: normal;
    margin: 0 0 0 10px;
  }
}
</style>
