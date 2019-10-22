<template>
  <div class="upload-container">
    <el-button icon="el-icon-upload" size="mini" type="primary" @click="dialogVisible = true">上传图片</el-button>
    <BaseDialog
      :visible.sync="dialogVisible"
      destroyOnClose
      :containerStyle="{height: 'calc(100% - 60px)', overflow: 'auto', paddingBottom: '60px'}"
    >
      <div>
        <UploadCropper
          :actionUrl="actionUrl"
          :fixedSize="fixedSize"
          :limit="20"
          :isCalcHeight="true"
          @success="handleSuccess"
        />
      </div>
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
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </BaseDialog>
  </div>
</template>

<script>
import UploadCropper from '@/components/UploadCropper/UploadCropper.vue';

export default {
  name: 'UploadImg',
  props: ['actionUrl', 'fixedSize'],
  components: {
    UploadCropper
  },
  data() {
    return {
      dialogVisible: false,
      fileList: []
    };
  },
  methods: {
    handleSubmit() {
      this.$emit('success', this.fileList);
      this.dialogVisible = false;
    },
    handleSuccess(val) {
      this.fileList = val;
    }
  }
};
</script>

<style lang="less" scoped>
</style>
