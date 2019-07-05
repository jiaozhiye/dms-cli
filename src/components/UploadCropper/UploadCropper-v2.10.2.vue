<template>
  <div class="upload-wrap">
    <el-upload
      ref="upload"
      action="#"
      list-type="picture-card"
      accept="image/jpeg, image/png, image/bmp"
      :limit="1"
      :multiple="false"
      :auto-upload="false"
      :file-list="fileList"
      :on-change="changeHandler"
      :http-request="upload"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{file}">
        <img class="el-upload-list__item-thumbnail" :src="imageUrl" alt />
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePreview(file)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span class="el-upload-list__item-delete" @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
      <div slot="tip" class="el-upload__tip">{{ tipText }}</div>
    </el-upload>
    <!-- 图片预览弹窗 -->
    <el-dialog title="图片预览" :visible.sync="dialogVisible">
      <img width="100%" class="img" :src="dialogImageUrl" alt />
    </el-dialog>
    <!-- 剪裁组件弹窗 -->
    <el-dialog title="图片裁剪" :visible.sync="cropperModel" width="800px" :before-close="beforeClose">
      <CropperPanel
        ref="uploadCropper"
        :img-file="file"
        :fixed-number="fixedSize"
        @upload="uploadHandler"
      ></CropperPanel>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import canvasCompress from './compress';
import CropperPanel from './CropperPanel';

export default {
  name: 'UploadCropper',
  props: {
    actionUrl: {
      type: String,
      default: '/api/upload'
    },
    initialValue: {
      type: String,
      default: ''
    },
    fixedSize: {
      type: Array,
      default() {
        return [5, 4];
      }
    },
    tipText: {
      type: String,
      default: '只能上传 jpg/png/bmp 文件'
    }
  },
  data() {
    this.fileData = null; // 文件裁剪之后的 blob
    this.uploadCard = null;
    this.uploadUl = null;
    this.uid = ''; // 文件的 uid
    return {
      file: null, // 当前被选择的图片文件
      fileList: [],
      imageUrl: this.initialValue,
      dialogVisible: false,
      cropperModel: false
    };
  },
  computed: {
    dialogImageUrl() {
      return this.imageUrl;
    }
  },
  watch: {
    initialValue(val) {
      this.imageUrl = val;
      !val && this.clearFiles();
    },
    imageUrl(val) {
      this.toggle(val);
      this.$emit('success', val);
      // 取消表单校验
      if (val !== '' && this.$parent.clearValidate) {
        this.$parent.clearValidate();
      }
    }
  },
  methods: {
    initial() {
      this.toggle(this.imageUrl);
      if (!this.imageUrl) return;
      this.fileList = [{ name: '-', url: '' }];
    },
    // element ui upload 组件的 dom 样式操作
    toggle(_path) {
      if (_path !== '') {
        this.uploadUl.style.display = 'block';
        this.uploadCard.style.display = 'none';
      } else {
        this.uploadUl.style.display = 'none';
        this.uploadCard.style.display = 'block';
      }
    },
    handlePreview(file) {
      this.dialogVisible = true;
    },
    handleRemove(file) {
      this.imageUrl = '';
      this.clearFiles();
    },
    clearFiles() {
      this.$refs.upload.clearFiles();
    },
    changeHandler(file, files) {
      if (this.uid === file.uid) return;
      this.uid = file.uid;
      this.file = file;
      this.cropperModel = true;
    },
    uploadHandler(data) {
      this.fileData = data;
      this.$refs.upload.submit();
    },
    async upload(params) {
      const formData = new FormData();
      const base64 = await canvasCompress({
        img: this.fileData,
        type: 'png',
        width: 640,
        quality: 0.8
      });
      // 有的后台需要传文件名，不然会报错
      formData.append('file', this.dataURItoBlob(base64.img), this.file.name);
      try {
        const { data } = await axios.post(this.actionUrl, formData);
        if (data.resultCode === 200) {
          this.imageUrl = data.data;
        } else {
          this.$message.error(data.message);
        }
      } catch (err) {
        this.clearFiles();
        this.$emit('error', err);
        this.$message.error('上传文件失败！');
      }
      this.cropperModel = false;
    },
    beforeClose() {
      this.clearFiles();
      this.cropperModel = false;
    },
    // base64 转成 bolb 对象
    dataURItoBlob(base64Data) {
      let byteString;
      if (base64Data.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(base64Data.split(',')[1]);
      } else {
        byteString = unescape(base64Data.split(',')[1]);
      }
      let mimeString = base64Data
        .split(',')[0]
        .split(':')[1]
        .split(';')[0];
      let ia = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ia], { type: mimeString });
    }
  },
  mounted() {
    this.uploadCard = this.$refs.upload.$el.querySelector('.el-upload');
    this.uploadUl = this.$refs.upload.$el.querySelector('.el-upload-list');
    this.initial();
  },
  updated() {
    const { uploadCropper } = this.$refs;
    uploadCropper && uploadCropper.Update();
  },
  components: {
    CropperPanel
  }
};
</script>

<style lang="less">
.upload-wrap {
  display: inline-block;
  width: 100%;
  .el-upload-list {
    height: 148px;
    li {
      margin: 0;
      height: 100%;
    }
  }
  .el-dialog__body {
    padding: 20px;
    display: flex;
    justify-content: center;
    .img {
      display: block;
      max-width: 100%;
    }
  }
}
</style>
