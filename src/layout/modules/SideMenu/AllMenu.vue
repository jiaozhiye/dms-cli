<template>
  <div :class="allMenuCls">
    <div class="title" :class="{ selected: visible ? !0 : !1 }" @click.stop="clickHandle">
      <i class="el-icon-menu" />
      <span v-if="!collapsed" class="text">{{ $t('sidebar.allNavTitle') }}</span>
    </div>
    <div :class="['mask', poperShow]" :style="{ left: asideWidth }" />
    <div :style="{ left: asideWidth }" :class="['poper', poperShow]" @click.stop>
      <div class="box">
        <slot :visible="visible" />
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-07 20:12:31
 **/
import { size } from '@/mixins/sizeMixin';
import addEventListener from 'add-dom-event-listener';

export default {
  name: 'AllMenu',
  mixins: [size],
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    this.evHandler = null;
    return {
      visible: false
    };
  },
  computed: {
    allMenuCls() {
      return {
        [`all-menu`]: !0,
        [`all-menu-sm`]: this.currentSize === 'small',
        [`all-menu-lg`]: this.currentSize === 'large'
      };
    },
    poperShow() {
      return this.visible ? 'show' : '';
    },
    asideWidth() {
      return !this.collapsed ? '200px' : '64px';
    }
  },
  mounted() {
    this.bindEvent();
  },
  destroyed() {
    this.evHandler.remove();
  },
  methods: {
    clickHandle() {
      this.visible = !this.visible;
    },
    bindEvent() {
      this.evHandler = addEventListener(document, 'click', ev => {
        this.visible = false;
      });
    },
    close() {
      this.visible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.all-menu {
  height: 36px;
  background-color: $menuBg;
  .title {
    height: 100%;
    line-height: 36px;
    color: $menuText;
    padding-left: 20px;
    cursor: pointer;
    &.selected,
    &:hover {
      background-color: $menuHover;
    }
    i {
      width: 24px;
      font-size: 16px;
      text-align: center;
      vertical-align: middle;
    }
    .text {
      margin-left: 2px;
      vertical-align: middle;
    }
  }
  .mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.65);
    z-index: -2;
    visibility: hidden;
    transition: all 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
    transform-origin: 50% 50% 0px;
    opacity: 0;
    &.show {
      visibility: visible;
      opacity: 0.2;
    }
  }
  .poper {
    position: absolute;
    top: 0;
    width: 650px;
    height: 100%;
    background: $allMenuBgColor;
    z-index: -1;
    box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
    transform: translate3d(-100%, 0, 0);
    transition: all 0.4s cubic-bezier(0.7, 0.3, 0.1, 1);
    transform-origin: 50% 50% 0px;
    opacity: 0;
    visibility: hidden;
    &.show {
      transform: translate3d(0, 0, 0);
      opacity: 1;
      visibility: visible;
    }
    .box {
      height: 100%;
    }
  }
  &-lg {
    height: 40px;
    .title {
      line-height: 40px;
    }
  }
  &-sm {
    height: 32px;
    .title {
      line-height: 32px;
    }
  }
}
</style>
