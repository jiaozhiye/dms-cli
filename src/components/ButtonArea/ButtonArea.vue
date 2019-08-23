<template>
  <div class="btn-area">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ButtonArea'
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
