<template>
  <div :class="['v-btn-area--wrapper', `btn-align-${align}`]" :style="containerStyle">
    <slot />
  </div>
</template>

<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-06 15:20:59
 **/
export default {
  name: 'ButtonArea',
  props: {
    align: {
      type: String,
      default: 'left'
    },
    containerStyle: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>

<style lang="less" scoped>
.v-btn-area--wrapper {
  font-size: 0;
  display: flex;
  flex-wrap: wrap;
  /deep/ .el-button {
    margin: 0;
    margin-bottom: @moduleMargin;
  }
  &.btn-align-left {
    justify-content: flex-start;
    & > * {
      margin-right: @moduleMargin !important;
    }
  }
  &.btn-align-right {
    justify-content: flex-end;
    & > * {
      margin-left: @moduleMargin !important;
    }
  }
}
</style>
