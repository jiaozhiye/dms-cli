<template>
  <div class="text">
    <p style="line-height: 40px">
      hello vue!
      <br>hello vue!
      <br>hello vue!
      <br>hello vue!
      <br>hello vue!
      <br>hello vue!
      <br>hello vue!
      <br>hello vue!
      <br>hello vue!
      <br>hello vue!
      <br>hello vue!
      <br>hello vue!
      <br>hello vue!
      <br>hello vue!
      <br>hello vue!
      <br>hello vue!
      <br>hello vue!
      <br>hello vue!
      <br>
    </p>
    <el-button type="primary">asdasd</el-button>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Home',
  data() {
    return {};
  },
  computed: {
    ...mapState('app', ['dict'])
  },
  methods: {
    eventHandler(val) {
      console.log('自定义事件', val);
    }
  }
};
</script>

<style scoped lang="less">
</style>