<template>
  <div class="side-wrap">
    <logo :collapsed="collapsed" />
    <all-menu :collapsed="collapsed">
      <MenuList :menu="navList" />
    </all-menu>
    <el-scrollbar class="menu-tree">
      <star-menu :collapsed="collapsed" />
      <menu-tree :menu="navList" :collapsed="collapsed" />
    </el-scrollbar>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Logo from './Logo';
import AllMenu from './AllMenu';
import MenuList from './MenuList';
import StarMenu from './StarMenu';
import MenuTree from './menuTree';

export default {
  name: 'SideMenu',
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
    AllMenu,
    MenuList,
    StarMenu,
    MenuTree
  }
};
</script>

<style lang="less">
.side-wrap {
  position: relative;
  height: 100%;
  background-color: @menuBg;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  z-index: 5;
  .menu-tree {
    height: calc(100vh - 116px);
    background-color: @menuBg;
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
}
</style>
