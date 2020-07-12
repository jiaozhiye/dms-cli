<template>
  <div class="nomatch-wrap">
    <div class="content">
      <h2>404</h2>
      <div class="desc">{{ $t('noMatch.text') }}</div>
      <div class="actions">
        <el-button type="primary" @click="goHome">{{ $t('login.backHome') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Nomatch',
  methods: {
    goHome() {
      this.$router.push({ path: '/' }).catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
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
      color: $textColorSecondary;
      font-size: 20px;
      line-height: 28px;
    }
  }
}
</style>
