<template>
  <div class="side-wrap">
    <logo :collapsed="collapsed" :title="title" />
    <all-menu :collapsed="collapsed">
      <MenuList :menu="navList" />
    </all-menu>
    <div class="scroll">
      <div class="inner">
        <star-menu :collapsed="collapsed" />
        <menu-tree class="side-menu" :menu="navList" :collapsed="collapsed" />
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-07 10:47:34
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
  components: {
    Logo,
    AllMenu,
    MenuList,
    StarMenu,
    MenuTree
  },
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
  .scroll {
    height: calc(100% - 60px - 40px);
    overflow-x: hidden;
    .inner {
      width: calc(100% + 17px);
      height: 100%;
      overflow-y: scroll;
    }
  }
}
</style>
