<template>
  <div class="dashboard">
    <el-button @click="clickHandle">读卡</el-button>
  </div>
</template>

<script>
import IDNumber from '@/components/IDNumber';

export default {
  name: 'Dashboard',
  data() {
    this.IDNumber = null;
    return {};
  },
  mounted() {
    this.IDNumber = new IDNumber();
  },
  destroyed() {
    this.IDNumber.destroye();
  },
  methods: {
    async clickHandle() {
      const res1 = await this.IDNumber.createConnect();
      console.log(res1);
      const res2 = await this.IDNumber.readCardInfo();
      console.log(res2);
    }
  }
};
</script>

<style lang="less" scoped>
.dashboard {
}
</style>
