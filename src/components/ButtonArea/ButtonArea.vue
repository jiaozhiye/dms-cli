<template>
  <div :class="['btn-area', `btn-align-${align}`]" :style="containerStyle">
    <slot />
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
.btn-area {
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
