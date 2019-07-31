<template>
  <div class="nomatch-wrap">
    <div class="content">
      <h2>404</h2>
      <div class="desc">抱歉，你访问的页面不存在或仍在开发中</div>
      <div class="actions">
        <el-button type="primary" size="small" @click="goHome">返回首页</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Nomatch',
  methods: {
    goHome() {
      this.$router.push({ path: '/' });
    }
  }
};
</script>

<style lang="less" scoped>
.nomatch-wrap {
  display: flex;
  height: 100%;
  align-items: center;
  background: url(../../assets/img/not-found.svg) 20vw 45% no-repeat;
  .content {
    flex: 1;
    margin-left: 55vw;
    h2 {
      margin-bottom: 24px;
      color: #434e59;
      font-weight: 600;
      font-size: 72px;
      line-height: 72px;
    }
    .desc {
      margin-bottom: 16px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 20px;
      line-height: 28px;
    }
  }
}
</style>
