<template>
  <div>
    <!-- 单图片上传 -->
    <el-upload
      ref="upload"
      action="#"
      list-type="picture-card"
      accept="image/jpeg, image/png, image/bmp"
      :multiple="false"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="handleCrop"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :http-request="upload"
    >
      <i class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <!-- 图片预览弹窗 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
    <!-- 剪裁组件弹窗 -->
    <el-dialog :visible.sync="cropperModel" width="800px" :before-close="beforeClose">
      <UploadCropper
        ref="uploadCropper"
        :img-file="file"
        :fixed-number="fixedNumber"
        @upload="uploadHandler"
      ></UploadCropper>
    </el-dialog>
  </div>
</template>

<script>
// https://juejin.im/post/5b3f14c2f265da0f5405080f
import axios from 'axios';
import UploadCropper from '@/components/UploadCropper/UploadCropper';

export default {
  props: {
    targetUrl: {
      // 上传地址
      type: String,
      default: '/api/basedata/upload'
    },
    initUrl: {
      // 初始图片地址
      type: String,
      default: ''
    },
    fixedNumber: {
      // 剪裁框比例设置
      type: Array,
      default: function() {
        return [4, 5];
      }
    }
  },
  data() {
    this.fileBlob = null;
    return {
      file: '', // 当前被选择的图片文件
      imageUrl: this.initUrl, // 单图情况框内图片链接
      dialogImageUrl: '', // 多图情况弹窗内图片链接
      dialogVisible: false, // 展示弹窗开关
      cropperModel: false // 剪裁组件弹窗开关
    };
  },
  watch: {
    initUrl(val) {
      this.imageUrl = val;
    }
  },
  methods: {
    handlePictureCardPreview(file) {
      //点击进行图片展示
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove(file) {},
    handleCrop(file, files) {
      // 点击弹出剪裁框
      this.cropperModel = true;
      this.file = file;
    },
    uploadHandler(data) {
      this.fileBlob = data;
      this.$refs.upload.submit();
    },
    async upload(params) {
      console.log(111, params);
      if (!this.fileBlob) return;
      let formData = new FormData();
      formData.append('file', this.fileBlob);
      const res = await axios.post(this.targetUrl, formData);
      // console.log(res.data.url);
      this.cropperModel = false;
    },
    beforeClose(done) {
      this.cropperModel = false;
    }
  },
  updated() {
    this.$refs.uploadCropper && this.$refs.uploadCropper.Update();
  },
  components: {
    UploadCropper
  }
};
</script>

<style lang="less">
</style>
