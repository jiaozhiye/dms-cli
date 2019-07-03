<template>
  <div>
    <!-- 单图片上传 -->
    <el-upload
      class="avatar-uploader"
      action
      :multiple="false"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="handleCrop"
      :http-request="upload"
    >
      <img
        v-if="imageUrl"
        :src="imageUrl"
        class="avatar"
        ref="singleImg"
        @mouseenter="mouseEnter"
        @mouseleave="mouseLeave"
        :style="{width:width+'px',height:height+'px'}"
      />
      <i
        v-else
        class="el-icon-plus avatar-uploader-icon"
        :style="{width:width+'px',height:height+'px','line-height':height+'px','font-size':height/6+'px'}"
      ></i>
      <div
        id="uploadIcon"
        v-if="imageUrl"
        ref="reupload"
        @mouseenter="mouseEnter"
        @mouseleave="mouseLeave"
        :style="{width:'100%'}"
      >
        <i
          class="el-icon-zoom-in"
          @click.stop="handlePreviewSingle"
          :style="{color:'#2E2E2E',fontSize:'25px',display:'inline-block',paddingRight:'15px'}"
        ></i>
        <i class="el-icon-upload" :style="{color:'#2E2E2E',fontSize:'25px',display:'inline-block'}"></i>
      </div>
      <div
        class="reupload"
        ref="uploading"
        :style="{width:reuploadWidth+'px',height:reuploadWidth+'px','line-height':reuploadWidth+'px','font-size':reuploadWidth/5+'px'}"
      >上传中..</div>
      <div
        class="reupload"
        ref="failUpload"
        :style="{width:reuploadWidth+'px',height:reuploadWidth+'px','line-height':reuploadWidth+'px','font-size':reuploadWidth/5+'px'}"
      >上传失败</div>
    </el-upload>
    <!-- 多图片预览弹窗 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
    <!-- 剪裁组件弹窗 -->
    <el-dialog :visible.sync="cropperModel" width="1100px" :before-close="beforeClose">
      <UploadCropper :img-file="file" ref="vueCropper" :fixedNumber="fixedNumber" @upload="upload"></UploadCropper>
    </el-dialog>
  </div>
</template>

<script>
// https://juejin.im/post/5b3f14c2f265da0f5405080f
import UploadCropper from '@/components/UploadCropper/UploadCropper';

export default {
  props: {
    targetUrl: {
      // 上传地址
      type: String,
      default: 'http://jettadms-dev.faw-vw.com/api/basedata/upload'
    },
    multiple: {
      // 多图开关
      type: Boolean,
      default: false
    },
    initUrl: {
      type: String,
      // 初始图片链接
      default: ''
    },
    fixedNumber: {
      type: Array,
      // 剪裁框比例设置
      default: function() {
        return [3, 1];
      }
    },
    width: {
      // 单图剪裁框宽度
      type: Number,
      default: 178
    },
    height: {
      // 单图剪裁框高度
      type: Number,
      default: 178
    }
  },
  data() {
    return {
      file: '', // 当前被选择的图片文件
      imageUrl: '', // 单图情况框内图片链接
      dialogImageUrl: '', // 多图情况弹窗内图片链接
      uploadList: [], // 上传图片列表
      reupload: true, // 控制 "重新上传" 开关
      dialogVisible: false, // 展示弹窗开关
      cropperModel: false, // 剪裁组件弹窗开关
      reuploadWidth: this.height * 0.7 // 动态改变 "重新上传" 大小
    };
  },
  watch: {
    initUrl: function(val) {
      if (val) {
        if (typeof this.initUrl === 'string') {
          this.imageUrl = val;
        } else {
          this.uploadList = this.formatImgArr(val);
        }
      }
    }
  },
  methods: {
    /****************************** single单图情况 **************************************/
    handlePreviewSingle(file) {
      //点击进行图片展示
      this.dialogImageUrl = this.file.url;
      this.dialogVisible = true;
    },
    mouseEnter() {
      //鼠标划入显示“重新上传”
      this.$refs.reupload.style.display = 'block';
      if (this.$refs.failUpload.style.display === 'block') {
        this.$refs.failUpload.style.display = 'none';
      }
      this.$refs.singleImg.style.opacity = '0.6';
    },
    mouseLeave() {
      // 鼠标划出隐藏“重新上传”
      this.$refs.reupload.style.display = 'none';
      this.$refs.singleImg.style.opacity = '1';
    },
    handleCrop(file, files) {
      console.log(file, files);
      // 点击弹出剪裁框
      this.cropperModel = true;
      this.file = file;
    },
    /************************************************************************************/
    upload(data) {
      // 自定义upload事件
      if (!this.multiple) {
        // 如果单图，则显示正在上传
        this.$refs.uploading.style.display = 'block';
      }
      let formData = new FormData();
      formData.append('attachment', data);
      axios.post(this.targetUrl, formData).then(res => {
        if (!this.multiple) {
          // 上传完成后隐藏正在上传
          this.$refs.uploading.style.display = 'none';
        }
        if (res.msg === 'success') {
          // 上传成功将照片传回父组件
          const currentPic = res.data.url;
          if (this.multiple) {
            this.uploadList.push({
              url: currentPic,
              uid: '111'
            });
            this.uploadList.pop();
            this.$emit('imgupload', this.formatImgArr(this.uploadList));
          } else {
            this.$emit('imgupload', currentPic);
          }
        } else {
          // 上传失败则显示上传失败，如多图则从图片列表删除图片
          if (!this.multiple) {
            this.$refs.failUpload.style.display = 'block';
          } else {
            this.uploadList.pop();
          }
        }
      });
      this.cropperModel = false;
    },
    formatImgArr(arr) {
      const result = arr.map((item, index) => {
        if (typeof item === 'string') {
          return {
            url: item,
            uid: `index${index}`
          };
        } else {
          return item.url;
        }
      });
      return result;
    },
    beforeClose(done) {
      this.uploadList.pop();
      this.cropperModel = false;
    }
  },
  mounted() {
    if (typeof this.initUrl === 'string') {
      this.imageUrl = this.initUrl;
    } else {
      this.uploadList = this.formatImgArr(this.initUrl);
    }
  },
  updated() {
    if (this.$refs.vueCropper) {
      this.$refs.vueCropper.Update();
    }
  },
  components: {
    UploadCropper
  }
};
</script>

<style lang="less">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  color: #8c939d;
  text-align: center;
}
.avatar {
  display: block;
}
.reupload {
  border-radius: 50%;
  position: absolute;
  color: #fff;
  background-color: #000000;
  opacity: 0.6;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: none;
}
#uploadIcon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: none;
}
</style>
