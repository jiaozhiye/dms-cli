<template>
  <menu-tree :menu="navList" :syncActive="false" :collapsed="collapsed" />
</template>

<script>
import { mapState, mapActions } from 'vuex';
import MenuTree from './menuTree';

export default {
  name: 'StarMenu',
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('app', ['starMenuList', 'commonMenuList']),
    navList() {
      return [
        {
          title: '常用导航',
          key: '/common',
          icon: 'el-icon-s-order',
          children: this.commonMenuList
        },
        {
          title: '我的收藏',
          key: '/star',
          icon: 'el-icon-star-on',
          children: this.starMenuList
        }
      ];
    }
  },
  components: {
    MenuTree
  }
};
</script>

<style lang="less" scoped>
</style>
