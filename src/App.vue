<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import '@/assets/css/reset.css';
import '@/assets/css/style.less';

export default {
  name: 'app',
  data() {
    return {};
  }
};
</script>

<style lang="less">
#app {
  height: 100%;
}
</style>