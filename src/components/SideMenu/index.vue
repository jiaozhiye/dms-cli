<template>
  <div class="side-wrap">
    <logo :collapsed="collapsed" :title="title" />
    <all-menu :collapsed="collapsed">
      <MenuList :menu="navList" />
    </all-menu>
    <el-scrollbar class="menu-tree">
      <star-menu :collapsed="collapsed" />
      <menu-tree class="side-menu" :menu="navList" :collapsed="collapsed" />
    </el-scrollbar>
  </div>
</template>

<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 10:00:00
 **/
import { mapState } from 'vuex';
import config from '@/config';
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
    ...mapState('app', ['navList']),
    title() {
      return config.systemName;
    }
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

<style lang="less" scoped>
.side-wrap {
  position: relative;
  height: 100%;
  background-color: @menuBg;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  z-index: 5;
  /deep/ .menu-tree {
    height: calc(100vh - 116px);
    background-color: @menuBg;
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
}
</style>
