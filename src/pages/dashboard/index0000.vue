<template>
  <div>
    <el-button type="primary" @click="clickHandle">按钮</el-button>
    <LazyLoadTab v-model="activeName" :tab-menus="menus" />
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Dashboard',
  data() {
    this.users = { a: 1, b: 2 };
    return {
      activeName: '菜单1',
      menus: [
        {
          title: '菜单1',
          path: 'dashboard/panel1',
          params: {
            type: 1
          }
        },
        {
          title: '菜单2',
          path: 'dashboard/panel2',
          params: {
            users: this.users
          }
        }
      ]
    };
  },
  methods: {
    ...mapActions('app', ['refreshView']),
    clickHandle() {
      this.menus[1].params.users = { ...this.users, c: 3 };
      // 刷新
      this.refreshView('/bjgl/cggl/dd');
      this.refreshView('/home');
    }
  }
};
</script>

<style scoped lang="less"></style>
