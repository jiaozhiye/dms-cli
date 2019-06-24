<template>
  <el-input v-model="val"></el-input>
</template>

<script>
import { authority } from '@/utils/mixin';
export default {
  name: 'Test',
  mixins: [authority],
  data() {
    return {
      val: ''
    };
  },
  mounted() {
    console.log('页面不具备的权限：', this.auths);
  }
};
</script>

<style lang="less">
</style>