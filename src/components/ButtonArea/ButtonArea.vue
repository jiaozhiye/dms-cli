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
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  & > * {
    margin: 0 10px 10px 0;
  }
}
</style>
