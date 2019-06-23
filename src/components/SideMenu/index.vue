<template>
  <div class="wrapper">
    <logo :collapsed="collapsed"/>
    <all-menu :collapsed="collapsed">
      <MenuList :menu="navList"/>
    </all-menu>
    <menu-tree class="menu-tree" :menu="navList" :collapsed="collapsed"/>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import MenuTree from './menuTree';
import AllMenu from './AllMenu';
import MenuList from './MenuList';
import Logo from './Logo';
export default {
  name: 'side-menu',
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('app', ['navList'])
  },
  components: {
    Logo,
    MenuTree,
    AllMenu,
    MenuList
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  position: relative;
  height: 100%;
  background-color: @asideBgColor;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  z-index: 2;
  .menu-tree {
    height: calc(100% - 116px);
    background-color: @asideBgColor;
    overflow-y: auto;
  }
}
</style>