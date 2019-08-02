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
        borderTop: '1px solid #e9e9e9',
        padding: '10px 20px',
        background: '#fff',
        textAlign: 'right'
      }"
    >
      <el-button @click="onClose">取 消</el-button>
      <el-button @click="onClose" type="primary">提 交</el-button>
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
    onClose() {
      this.$emit('close', false);
    }
  }
};
</script>

<style lang="less" scoped>
</style>
