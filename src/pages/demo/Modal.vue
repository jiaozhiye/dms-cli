<template>
  <div>
    <div>
      <PortalPage :height="height" loginUrl="https://portal.faw-vw.com/pkmslogin.form" :loginParams="params" pageUrl="https://portal.faw-vw.com/EP/topicSource/toInsert.do" />
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
      <el-button type="primary" @click="closeDialog">提 交</el-button>
    </div>
  </div>
</template>

<script>
import PortalPage from '@/components/PortalPage';

export default {
  name: 'Modal',
  components: {
    PortalPage
  },
  props: ['height'],
  data() {
    return {
      params: {
        username: 'Liu00001',
        password: 'b6agrdFb',
        'login-form-type': 'pwd'
      }
    };
  },
  methods: {
    closeDialog() {
      this.$emit('close', false);
    }
  }
};
</script>

<style lang="less" scoped></style>
