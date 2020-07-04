<template>
  <div class="header">
    <div class="box fl">
      <slot name="collapse" />
    </div>
    <div class="box fr">
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
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-18 08:15:07
 **/
export default {
  name: 'GlobalHeader'
};
</script>

<style lang="scss" scoped>
.header {
  height: 56px;
  margin: 0 -20px;
  background-color: #fff;
  border-bottom: 1px solid $borderColor;
  position: relative;
  z-index: 3;
  .menus {
    margin: 0 240px 0 60px;
    padding-top: 16px;
  }
  .box {
    height: 100%;
  }
}
</style>
