<template>
  <div class="upload-wrap">
    <el-upload
      ref="upload"
      action="#"
      list-type="picture-card"
      accept="image/jpeg, image/png, image/bmp"
      :limit="limit"
      :multiple="false"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="changeHandler"
      :http-request="upload"
    >
      <div
        class="el-upload-list__item"
        v-for="(imgUrl, index) in imgUrlArr"
        :key="imgUrl"
        @click.stop
      >
        <img class="img" :src="imgUrl" alt />
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-dot" @click="handlePreview(index)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span class="el-upload-list__item-dot" @click="handleRemove(index)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
      <div
        v-if="imgUrlArr.length !== limit"
        slot="default"
        class="upload-icon-plus el-upload-list__item"
      >
        <i class="el-icon-plus"></i>
      </div>
      <div slot="tip" class="el-upload__tip">{{ tipText }}</div>
    </el-upload>
    <!-- 图片预览弹窗 -->
    <el-dialog custom-class="dialog-wrap" title="图片预览" :visible.sync="dialogVisible">
      <img class="img" :src="dialogImageUrl" alt />
    </el-dialog>
    <!-- 剪裁组件弹窗 -->
    <el-dialog
      custom-class="dialog-wrap"
      title="图片裁剪"
      :visible.sync="cropperModel"
      width="800px"
      :before-close="beforeClose"
    >
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
      type: Array,
      default: () => []
    },
    isCalcHeight: {
      type: Boolean,
      default: false
    },
    fixedSize: {
      type: Array,
      default() {
        return [5, 4];
      }
    },
    limit: {
      type: Number,
      default: 1
    },
    tipText: {
      type: String,
      default: '只能上传 jpg/png/bmp 文件'
    }
  },
  data() {
    this.uploadWrap = null;
    this.fileData = null; // 文件裁剪之后的 blob
    this.uid = ''; // 文件的 uid
    this.width = 148;
    this.height = 148;
    this.dialogImageUrl = ''; // 预览图片地址
    return {
      file: null, // 当前被选择的图片文件
      imgUrlArr: this.initialValue,
      dialogVisible: false,
      cropperModel: false
    };
  },
  watch: {
    initialValue(val) {
      this.imgUrlArr = val;
      !val.length && this.clearFiles();
    },
    imgUrlArr(val) {
      this.$emit('success', val);
      // 取消表单校验
      if (val.length && this.$parent.clearValidate) {
        this.$parent.clearValidate();
      }
    }
  },
  methods: {
    handlePreview(index) {
      this.dialogImageUrl = this.imgUrlArr[index];
      this.dialogVisible = true;
    },
    handleRemove(index) {
      this.imgUrlArr.splice(index, 1);
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
        type: 'jpg',
        fillColor: '#fff',
        width: 750
      });
      // 有的后台需要传文件名，不然会报错
      formData.append('file', this.dataURItoBlob(base64.img), this.file.name);
      try {
        const { data } = await axios.post(this.actionUrl, formData);
        if (data.resultCode === 200) {
          this.imgUrlArr.push(data.data);
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
    setUploadWrapHeight() {
      const iHeight = !this.isCalcHeight ? this.height : Number.parseInt((this.width * this.fixedSize[1]) / this.fixedSize[0]);
      this.uploadWrap.style.height = `${iHeight}px`;
      this.uploadWrap.style.lineHeight = `${iHeight - 2}px`;
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
    this.uploadWrap = this.$refs.upload.$el.querySelector('.el-upload');
    this.setUploadWrapHeight();
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
  width: 100%;
  float: left;
  .el-upload--picture-card {
    display: flex;
    width: 100% !important;
    height: 148px;
    background: none;
    border: none;
    border-radius: 0;
    .el-upload-list__item {
      position: relative;
      width: 148px;
      height: 100%;
      line-height: inherit;
      margin: 0 10px 0 0;
      border-radius: 6px;
      background-color: #fff;
      border: 1px dashed #c0ccda;
      overflow: hidden;
      .img {
        display: block;
        max-width: 100%;
      }
      .el-upload-list__item-actions {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        cursor: default;
        opacity: 0;
        background-color: rgba(0, 0, 0, 0.5);
        transition: all 0.3s;
        &:hover {
          opacity: 1;
        }
        .el-upload-list__item-dot {
          display: inline-block;
          width: 20px;
          padding: 0 10px;
          cursor: pointer;
          i {
            font-size: 20px;
            color: #fff;
          }
        }
      }
    }
    .upload-icon-plus {
      i {
        vertical-align: middle;
      }
    }
  }
  .el-upload__tip {
    line-height: 20px;
  }
  .dialog-wrap {
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
}
</style>
