<template>
  <div :class="['btn-area', align]" :style="containerStyle">
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
  & > * {
    margin: 0;
    margin-bottom: @moduleMargin;
  }
  &.left {
    justify-content: flex-start;
    & > * {
      margin-right: @moduleMargin !important;
    }
  }
  &.right {
    justify-content: flex-end;
    & > * {
      margin-left: @moduleMargin !important;
    }
  }
}
</style>
