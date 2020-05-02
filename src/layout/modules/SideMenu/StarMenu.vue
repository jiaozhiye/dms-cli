<template>
  <menu-tree ref="starMenu" class="star-menu" :menu="navList" :sync-active="false" :collapsed="collapsed" />
</template>

<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-02 08:02:23
 **/
import { mapState, mapActions } from 'vuex';
import MenuTree from './menuTree';

export default {
  name: 'StarMenu',
  components: {
    MenuTree
  },
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    this.starMenuRef = null;
    return {};
  },
  computed: {
    ...mapState('app', ['starMenuList', 'commonMenuList']),
    navList() {
      return [
        {
          title: this.$t('sidebar.usedNav'),
          key: null,
          icon: 'icon-flag-fill',
          children: this.commonMenuList
        },
        {
          title: this.$t('sidebar.starNav'),
          key: null,
          icon: 'icon-star-fill',
          children: this.starMenuList
        }
      ];
    },
    allMenuList() {
      const keys = [...this.starMenuList, ...this.commonMenuList].map(x => x.key);
      return [...new Set(keys)];
    }
  },
  watch: {
    $route({ path }) {
      this.starMenuRef.activeIndex = path;
      if (!this.allMenuList.includes(path)) {
        this.starMenuRef.activeIndex = '';
      }
    }
  },
  mounted() {
    this.starMenuRef = this.$refs.starMenu.$children[0];
  }
};
</script>
