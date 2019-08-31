<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import '@/assets/css/reset.css';
import '@/assets/css/iconfont.css';
import '@/assets/css/style.less';

export default {
  name: 'app'
};
</script>

<style lang="less">
#app {
  height: 100%;
}
</style>
