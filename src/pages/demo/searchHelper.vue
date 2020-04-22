<template>
  <div>
    <div>表单搜索帮助 内容</div>
    <div
      :style="{
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 9,
        borderTop: '1px solid #d9d9d9',
        padding: '10px 15px',
        background: '#fff',
        textAlign: 'right'
      }"
    >
      <el-button @click="cancelHandle()">关闭</el-button>
      <el-button type="primary" @click="confirmHandle">确定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    confirmHandle() {
      // ...
      this.cancelHandle('hello');
    },
    cancelHandle(val) {
      this.$emit('close', false, val);
    }
  }
};
</script>
