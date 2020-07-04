<template>
  <div class="upload-container">
    <el-button icon="el-icon-upload" size="mini" type="primary" @click="dialogVisible = true">{{ t('tinymce.uploadImg') }}</el-button>
    <BaseDialog :visible.sync="dialogVisible" destroy-on-close :container-style="{ height: 'calc(100% - 60px)', overflow: 'auto', paddingBottom: '60px' }">
      <div>
        <UploadCropper :action-url="actionUrl" :headers="headers" :fixed-size="fixedSize" :limit="20" :is-calc-height="true" @change="handleSuccess" />
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
        <el-button @click="dialogVisible = false">{{ t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleSubmit">{{ t('button.confirm') }}</el-button>
      </div>
    </BaseDialog>
  </div>
</template>

<script>
import UploadCropper from '../UploadCropper';
import Locale from '../_utils/mixins/locale';

export default {
  name: 'UploadImg',
  components: {
    UploadCropper
  },
  mixins: [Locale],
  props: ['actionUrl', 'headers', 'fixedSize'],
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
