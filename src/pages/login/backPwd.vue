<template>
  <div class="wrapper">
    <div class="scroll">
      <div class="box">
        <el-form ref="form-phone" size="medium" :model="form" :rules="rules">
          <el-form-item prop="phone">
            <el-input v-model="form.phone" prefix-icon="el-icon-mobile-phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="form.vcode" type="password" class="fl" placeholder="验证码" style="width: 50%" prefix-icon="el-icon-message" />
            <el-button class="fr" style="width: 38%">获取验证码</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="medium" :disabled="!isNextStep" @click="nextHandle">下一步</el-button>
      </div>
      <div class="box">
        <el-input v-model="newPassword" prefix-icon="el-icon-lock" placeholder="重置密码" />
        <el-button type="primary">确 定</el-button>
        <el-button type="text" class="btn" @click="closeHandle">返回首页</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { phone } from '@/utils/validate';

export default {
  name: '',
  data() {
    return {
      form: {
        phone: '',
        vcode: ''
      },
      newPassword: '',
      rules: {
        phone: [{ required: true, validator: phone, trigger: 'blur' }]
      },
      isNextStep: false
    };
  },
  methods: {
    nextHandle() {},
    closeHandle(val) {
      this.$emit('close', val);
    }
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  overflow: hidden;
  .scroll {
    width: 200%;
    min-height: 160px;
    display: flex;
    transition: transform 0.3s ease;
    .box {
      width: 50%;
      /deep/ .el-form-item {
        margin-bottom: 20px;
      }
      /deep/ .el-input__inner {
        font-size: 14px;
        border: 0;
        border-bottom: 1px solid #d6d6d6 !important;
      }
      /deep/ .el-input__icon {
        font-size: 18px;
      }
      .btn {
        font-size: 14px;
        margin-top: 20px;
      }
    }
  }
}
</style>
