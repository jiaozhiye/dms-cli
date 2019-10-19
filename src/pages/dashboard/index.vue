<template>
  <div>
    <el-button type="primary" @click="clickHandle">按钮</el-button>
    <LazyLoadTab v-model="activeName" :tabMenus="menus" />
  </div>
</template>

<script>
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
    clickHandle() {
      this.menus[1].params.users = { ...this.users, c: 3 };
    }
  }
};
</script>

<style scoped lang="less">
</style>
