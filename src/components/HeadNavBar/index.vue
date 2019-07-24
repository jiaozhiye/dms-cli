<template>
  <div class="actions">
    <ScreenFull />
    <div class="setting" @click="clickHandle">个人中心</div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import ScreenFull from '@/components/ScreenFull';

export default {
  name: 'HeadAction',
  data() {
    return {};
  },
  methods: {
    ...mapActions('app', ['refreshView']),
    clickHandle() {
      this.refreshView(this.$route.path);
    }
  },
  components: {
    ScreenFull
  }
};
</script>

<style lang="less" scoped>
.actions {
  height: 100%;
  margin-right: @moduleMargin;
  display: flex;
  align-items: center;
  .setting {
    width: 100%;
    height: 30px;
    text-align: center;
    line-height: 30px;
    background: #e3e3e3;
  }
}
</style>
