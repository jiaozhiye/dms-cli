<template>
  <div class="wrapper">
    <logo :collapsed="collapsed"/>
    <all-menu :collapsed="collapsed"/>
    <menu-tree class="menu-list" :menu="navList" :collapsed="collapsed"/>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import MenuTree from './index';
import AllMenu from './AllMenu';
import Logo from '@/components/Logo';
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
    AllMenu
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  position: relative;
  height: 100%;
  background-color: #001529;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  .menu-list {
    height: calc(100% - 116px);
    overflow-y: auto;
  }
}
</style>