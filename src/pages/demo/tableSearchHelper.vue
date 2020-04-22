<template>
  <div>
    <div>表格搜索帮助 内容</div>
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
  props: ['row', 'dataIndex', 'callback'],
  methods: {
    confirmHandle() {
      // ...
      this.callback && this.callback('hello', { 'person.age': 20 });
      this.cancelHandle();
    },
    cancelHandle() {
      this.$emit('close', false);
    }
  }
};
</script>
