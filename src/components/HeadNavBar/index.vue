<template>
  <div class="actions">
    <ScreenFull/>
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
  display: flex;
  align-items: center;
}
</style>
