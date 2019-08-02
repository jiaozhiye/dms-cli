<template>
  <div>
    <div>
      内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容
      <br />内容1
    </div>
    <div
      :style="{
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 9,
        borderTop: '1px solid #e9e9e9',
        padding: '10px 20px',
        background: '#fff',
        textAlign: 'right'
      }"
    >
      <el-button @click="closeDialog">取 消</el-button>
      <el-button @click="closeDialog" type="primary">提 交</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  data() {
    return {};
  },
  methods: {
    closeDialog() {
      this.$emit('close', false);
    }
  }
};
</script>

<style lang="less" scoped>
</style>
