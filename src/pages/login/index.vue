<template>
  <el-row class="login-wrapper">
    <el-col :span="6" :offset="9">
      <h3 class="welcome">欢迎使用</h3>
      <el-form class="app-form" ref="form" label-position="top" :model="form" :rules="rules">
        <el-form-item label="请输入用户名" prop="username">
          <el-input v-model="form.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="请输入密码" prop="password">
          <el-input
            type="password"
            v-model="form.password"
            placeholder="密码"
            @keyup.enter.native="doLogin"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            style="width: 100%"
            @click.stop="doLogin"
            :loading="btnLoading"
          >登 录</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { doLogin } from '@/api';

export default {
  name: 'Login',
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名.', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码.', trigger: 'blur' }, { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }]
      }
    };
  },
  methods: {
    ...mapActions('app', ['createLoginInfo']),
    async doLogin() {
      const res = await doLogin({
        username: this.form.username,
        password: this.form.password
      });
      if (res.code === 1) {
        this.createLoginInfo({
          id: res.data.id,
          name: res.data.name,
          roles: res.data.roles || [],
          token: res.data.token
        });
        this.$router.push({ path: '/' });
      } else {
        this.$message.error(res.message);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.login-wrapper {
  height: 100vh;
  background: #f2f2f2;
  .welcome {
    text-align: center;
    padding: 60px 0 30px;
    font-size: 30px;
    font-weight: normal;
    line-height: 40px;
  }
  .app-form {
    padding: 10px 20px 0;
    background-color: #fff;
    border: 1px solid #d8dee2;
    border-radius: 5px;
  }
}
</style>