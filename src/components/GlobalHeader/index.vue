<template>
  <div class="header">
    <span class="trigger fl" @click="clickHandler">
      <i :class="[isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']" />
    </span>
    <div class="action fr">
      <slot name="action" />
    </div>
    <div class="menus">
      <slot name="menu" />
    </div>
  </div>
</template>

<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 10:00:00
 **/
export default {
  name: 'GlobalHeader',
  props: {
    collapsed: {
      type: Boolean,
      default: false
    },
    toggle: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      isCollapse: this.collapsed
    };
  },
  methods: {
    clickHandler() {
      this.isCollapse = !this.isCollapse;
      this.toggle(this.isCollapse);
    }
  }
};
</script>

<style lang="less" scoped>
.header {
  height: 60px;
  margin: 0 -20px;
  background-color: #fff;
  border-bottom: 1px solid @borderColor;
  position: relative;
  z-index: 1;
  .trigger {
    display: inline-block;
    font-size: 24px;
    line-height: 60px;
    padding: 0 20px;
    cursor: pointer;
    transition: color 0.3s ease;
    &:hover {
      background-color: rgba(0, 0, 0, 0.03);
    }
  }
  .menus {
    margin: 0 200px 0 65px;
    padding-top: 20px;
  }
  .action {
    height: 60px;
  }
}
</style>
