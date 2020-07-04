<template>
  <div class="wrapper">
    <div class="scroll">
      <div class="box">
        <el-form ref="form-phone" size="medium" :model="form" :rules="rules">
          <el-form-item prop="phone">
            <el-input v-model="form.phone" prefix-icon="el-icon-mobile-phone" :placeholder="$t('login.phone')" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="form.vcode" type="password" class="fl" :placeholder="$t('login.authCode')" style="width: 50%" prefix-icon="el-icon-message" />
            <el-button class="fr" style="width: 38%">{{ $t('login.getAuthCode') }}</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="medium" :disabled="!isNextStep" @click="nextHandle">{{ $t('login.nextStep') }}</el-button>
      </div>
      <div class="box">
        <el-input v-model="newPassword" prefix-icon="el-icon-lock" :placeholder="$t('login.resetPassword')" />
        <el-button type="primary">{{ $t('button.confirm') }}</el-button>
        <el-button type="text" class="btn" @click="closeHandle">{{ $t('login.backHome') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { language } from '@/mixins/langMixin';
import { phoneValidate } from '@/utils/validate';

export default {
  mixins: [language],
  data() {
    return {
      form: {
        phone: '',
        vcode: ''
      },
      newPassword: '',
      rules: {
        phone: [{ required: true, validator: phoneValidate, trigger: 'blur' }]
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

<style lang="scss" scoped>
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
