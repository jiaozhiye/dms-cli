<template>
  <div class="btn-area" :style="containerStyle">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ButtonArea',
  props: {
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
  justify-content: flex-start;
  & > * {
    margin: 0 @moduleMargin @moduleMargin 0 !important;
  }
}
</style>
