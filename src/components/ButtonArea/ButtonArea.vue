<template>
  <div :class="['btn-area', `btn-align-${align}`]" :style="containerStyle">
    <slot></slot>
  </div>
</template>

<script>
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
  .el-button {
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
