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
      :disabled="disabled"
      :http-request="upload"
      :on-change="changeHandler"
    >
      <div v-for="(item, index) in fileList" :key="index" class="el-upload-list__item" @click.stop>
        <img class="img" :src="item.url" alt />
        <h5 v-if="!!titles[index]" class="title">{{ titles[index] }}</h5>
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-dot">
            <i class="el-icon-zoom-in" @click="handlePreview(index)" />
          </span>
          <span class="el-upload-list__item-dot">
            <i class="el-icon-delete" @click="handleRemove(index)" />
          </span>
          <span class="el-upload-list__item-dot">
            <i class="el-icon-download" @click="downloadHandle(index)" />
          </span>
        </span>
      </div>
      <div v-if="fileList.length !== limit" slot="default" class="upload-icon-plus el-upload-list__item">
        <i class="el-icon-plus" />
        <span>{{ titles[fileList.length] }}</span>
      </div>
      <div slot="tip" class="el-upload__tip">{{ `只能上传 ${fileTypes.join(',')} 格式的图片` }}</div>
    </el-upload>
    <!-- 图片预览弹窗 -->
    <BaseDialog :visible.sync="dialogVisible" title="图片预览">
      <div class="preview-wrap">
        <img :src="dialogImageUrl" alt />
      </div>
    </BaseDialog>
    <!-- 剪裁组件弹窗 -->
    <BaseDialog :visible.sync="cropperModel" title="图片裁剪" width="800" @close="beforeClose">
      <CropperPanel ref="uploadCropper" :img-file="file" :fixed-number="fixedSize" :loading.sync="isLoading" @upload="uploadHandler" />
    </BaseDialog>
  </div>
</template>

<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-12-25 09:46:16
 **/
import axios, { getConfigHeaders } from '@/api/fetch';
import canvasCompress from './compress';
import CropperPanel from './CropperPanel';

export default {
  name: 'UploadCropper',
  components: {
    CropperPanel
  },
  props: {
    actionUrl: {
      type: String,
      required: true
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
      default: () => [5, 4]
    },
    titles: {
      type: Array,
      default: () => []
    },
    limit: {
      type: Number,
      default: 1
    },
    params: {
      type: Object,
      default: () => ({})
    },
    fileTypes: {
      type: Array,
      default: () => ['jpg', 'png', 'bmp']
    },
    disabled: {
      type: Boolean,
      default: false
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
      fileList: this.initialValue,
      dialogVisible: false,
      cropperModel: false,
      isLoading: false
    };
  },
  watch: {
    initialValue(val) {
      this.fileList = val;
    },
    fileList(val) {
      this.$emit('change', val);
      if (val.length === this.limit) {
        this.$parent.clearValidate && this.$parent.clearValidate();
      }
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
  methods: {
    handlePreview(index) {
      this.dialogImageUrl = this.fileList[index].url;
      this.dialogVisible = true;
    },
    handleRemove(index) {
      this.fileList.splice(index, 1);
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
    async upload() {
      const { params } = this.$props;
      const formData = new FormData();
      const base64 = await canvasCompress({
        img: this.fileData,
        type: 'jpg',
        fillColor: '#fff',
        width: 750
      });
      // 有的后台需要传文件名，不然会报错
      formData.append('file', this.dataURItoBlob(base64.img), this.file.name);
      // 处理请求的额外参数
      for (let key in params) {
        formData.append(key, params[key]);
      }
      try {
        const res = await axios.post(this.actionUrl, formData);
        if (res.resultCode === 200) {
          this.fileList.push({ name: this.file.name, url: res.data || '' });
        }
      } catch (err) {
        this.$emit('error', err);
        this.$message.error('图片上传失败！');
      }
      this.cropperModel = false;
      this.isLoading = false;
    },
    beforeClose() {
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
    },
    async downloadHandle(index) {
      try {
        await this.downloadFile(this.fileList[index]);
      } catch (err) {
        this.$message.error('图片下载失败！');
      }
    },
    // 获取服务端文件 to blob
    async downLoadByUrl(url, params = {}) {
      const { data } = await axios({ url, params, responseType: 'blob' });
      return data;
    },
    // 执行下载动作
    async downloadFile({ url, name }, params) {
      const blob = await this.downLoadByUrl(url, params);
      const fileName = !name ? url.slice(url.lastIndexOf('/') + 1) : name;
      // ie10+
      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, decodeURI(fileName));
      } else {
        const downloadUrl = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = downloadUrl;
        a.download = decodeURI(fileName);
        a.click();
        a = null;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.upload-wrap {
  width: 100%;
  float: left;
  & > div {
    display: inline-block;
  }
  /deep/ .el-upload--picture-card {
    display: flex;
    width: 100% !important;
    height: 148px;
    background: none;
    border: none;
    border-radius: 0;
    pointer-events: none;
    .el-upload-list__item {
      position: relative;
      width: 148px;
      height: 100%;
      line-height: inherit;
      margin: 0 10px 0 0;
      border-radius: 6px;
      background-color: #fff;
      border: 1px dashed #c0ccda;
      pointer-events: auto !important;
      overflow: hidden;
      .title {
        position: absolute;
        width: 100%;
        height: 20px;
        background-color: rgba(0, 0, 0, 0.6);
        left: 0;
        right: 0;
        bottom: 0;
        line-height: 20px;
        color: #fff;
        font-size: 12px;
      }
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
}
.preview-wrap {
  display: flex;
  justify-content: center;
  img {
    display: block;
    max-width: 100%;
  }
}
</style>
