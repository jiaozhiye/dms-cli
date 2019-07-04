<template>
  <div>
    <el-form :model="form" :rules="rules" label-width="100px" ref="ruleForm">
      <el-form-item label="活动名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="活动图片" prop="imgPath">
        <UploadCropper
          action-url="/api/basedata/upload"
          :initial-value="form.imgPath"
          :fixed-size="[4, 5]"
          @success="successHandler"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import UploadCropper from '@/components/UploadCropper/UploadCropper-v2.9.1.vue';

export default {
  name: 'Upload',
  data() {
    return {
      form: {
        name: '',
        imgPath: ''
      },
      rules: {
        name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        imgPath: [{ required: true, message: '请上传图片', trigger: 'change' }]
      }
    };
  },
  methods: {
    successHandler(val) {
      this.form.imgPath = val;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  components: {
    UploadCropper
  }
};
</script>

<style lang="less">
</style>
