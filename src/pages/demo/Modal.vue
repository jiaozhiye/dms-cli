<template>
  <div>
    <PortalPage
      class="portal-height"
      loginUrl="https://portal.faw-vw.com/pkmslogin.form"
      :loginParams="params"
      pageUrl="https://portal.faw-vw.com/asjct/SAPAfterSales/pages/dserpthreepack/threepackcx_result.jsp?vin="
      :containerStyle="{ minHeight: 'calc(80vh - 140px)' }"
    />
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
  data() {
    return {
      params: {
        username: 'SA22001R01',
        password: 'AUfw3202',
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
