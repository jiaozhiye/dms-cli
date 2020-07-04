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
 * @Last Modified time: 2020-05-17 16:18:18
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

<style lang="scss" scoped>
.side-wrap {
  position: relative;
  height: 100%;
  background-color: $menuBg;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  z-index: 5;
  .scroll {
    height: calc(100% - 56px - 40px);
    background-color: $menuBg;
    overflow-x: hidden;
    .inner {
      width: calc(100% + 17px);
      height: 100%;
      overflow-y: scroll;
    }
  }
  /* 侧栏菜单导航 */
  /deep/ .el-menu {
    border: none;
    height: 100%;
    width: 100% !important;
    .el-menu-item {
      height: 40px;
      line-height: 40px;
      /* 文本溢出截断 */
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      * {
        vertical-align: baseline;
      }
    }
    .el-submenu {
      & [class^='el-icon-'],
      & [class^='iconfont icon-'] {
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
        width: 24px;
        text-align: center;
        font-size: 18px;
      }
      .el-submenu__title {
        height: 40px;
        line-height: 40px;
        &:hover {
          background-color: $menuHover !important;
        }
      }
      .el-menu-item {
        padding-right: $modulePadding !important;
        background-color: $subMenuBg !important;
        a {
          display: block;
          color: $menuText;
        }
        &:hover {
          background-color: $subMenuHover !important;
        }
        &.is-active {
          color: $subMenuActiveText !important;
          background-color: $primaryColor !important;
        }
      }
    }
  }
  /* 不包含 我的收藏/常用导航 */
  .side-menu {
    /deep/ .el-menu {
      .is-active {
        & > .el-submenu__title {
          color: $subMenuActiveText !important;
          i {
            color: $subMenuActiveText !important;
          }
        }
      }
    }
  }
}
</style>
