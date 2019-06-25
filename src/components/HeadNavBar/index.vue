<template>
  <div class="actions">
    <ScreenFull/>
    <div class="setting"></div>
  </div>
</template>

<script>
import ScreenFull from '@/components/ScreenFull';

export default {
  name: 'HeadAction',
  data() {
    return {};
  },
  components: {
    ScreenFull
  }
};
</script>

<style lang="less" scoped>
.actions {
  height: 100%;
  margin-right: 10px;
  display: flex;
  align-items: center;
  .setting {
    width: 100%;
    height: 30px;
    background: #e3e3e3;
  }
}
</style>
