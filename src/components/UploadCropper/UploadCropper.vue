<template>
  <div>
    <div class="cropper-content">
      <!-- 剪裁框 -->
      <div class="cropper">
        <Cropper
          ref="cropper"
          :img="option.img"
          :outputSize="option.size"
          :outputType="option.outputType"
          :info="true"
          :full="option.full"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :original="option.original"
          :autoCrop="option.autoCrop"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
          :fixedBox="option.fixedBox"
          :fixed="option.fixed"
          :fixedNumber="fixedNumber"
          @realTime="realTime"
        />
      </div>
      <!-- 预览框 -->
      <div
        class="show-preview"
        :style="{'width': '300px', 'height': '300px',  'overflow': 'hidden', 'display':'flex', 'align-items' : 'center'}"
      >
        <div :style="previews.div" class="preview">
          <img :src="previews.url" :style="previews.img">
        </div>
      </div>
    </div>
    <div class="footer-btn">
      <!-- 缩放旋转按钮 -->
      <div class="scope-btn">
        <el-button type="primary" icon="el-icon-zoom-in" @click="changeScale(1)">放大</el-button>
        <el-button type="primary" icon="el-icon-zoom-out" @click="changeScale(-1)">缩小</el-button>
        <el-button type="primary" icon="el-icon-refresh-right" @click="rotateRight">顺时针</el-button>
        <el-button type="primary" icon="el-icon-refresh-left" @click="rotateLeft">逆时针</el-button>
      </div>
      <!-- 确认上传按钮 -->
      <div class="upload-btn">
        <el-button type="primary" @click="uploadImg('blob')">上传</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Cropper from './Cropper.vue';

export default {
  name: 'UploadCropper',
  data() {
    return {
      previews: {}, // 预览数据
      downImg: '#',
      option: {
        img: '', // 裁剪图片的地址  (默认：空)
        size: 1, // 裁剪生成图片的质量  (默认:1)
        full: true, // 是否输出原图比例的截图 选true生成的图片会非常大  (默认:false)
        outputType: 'png', // 裁剪生成图片的格式  (默认:jpg)
        canMove: true, // 上传图片是否可以移动  (默认:true)
        original: false, // 上传图片按照原始比例渲染  (默认:false)
        canMoveBox: true, // 截图框能否拖动  (默认:true)
        autoCrop: true, // 是否默认生成截图框  (默认:false)
        autoCropWidth: 400, // 默认生成截图框宽度  (默认:80%)
        autoCropHeight: 400, // 默认生成截图框高度  (默认:80%)
        fixedBox: false, // 固定截图框大小 不允许改变  (默认:false)
        fixed: true, // 是否开启截图框宽高固定比例  (默认:true)
        fixedNumber: [1.5, 1] // 截图框比例  (默认:[1:1])
      }
    };
  },
  props: ['imgFile', 'fixedNumber'],
  methods: {
    changeScale(num = 1) {
      // 图片缩放
      this.$refs.cropper.changeScale(num);
    },
    rotateLeft() {
      // 向左旋转
      this.$refs.cropper.rotateLeft();
    },
    rotateRight() {
      // 向右旋转
      this.$refs.cropper.rotateRight();
    },
    Update() {
      this.option.img = this.imgFile.url;
    },
    realTime(data) {
      // 实时预览
      this.previews = data;
    },
    uploadImg(type) {
      // 将剪裁好的图片回传给父组件
      event.preventDefault();
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob(data => {
          this.$emit('upload', data);
        });
      } else {
        this.$refs.cropper.getCropData(data => {
          this.$emit('upload', data);
        });
      }
    }
  },
  components: {
    Cropper
  }
};
</script>
<style lang="less">
.cropper-content {
  display: flex;
  justify-content: flex-end;
  -webkit-justify-content: flex-end;
}
.cropper-content .cropper {
  width: 350px;
  height: 300px;
}
.cropper-content .show-preview {
  flex: 1;
  -webkit-flex: 1;
  display: flex;
  justify-content: center;
  -webkit-justify-content: center;
  overflow: hidden;
  background: #cccccc;
  margin-left: 20px;
}
.preview {
  overflow: hidden;
}
.footer-btn {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
  -webkit-justify-content: flex-end;
}
.footer-btn .scope-btn {
  width: 350px;
  display: flex;
  justify-content: space-between;
  -webkit-justify-content: space-between;
}
.footer-btn .upload-btn {
  flex: 1;
  -webkit-flex: 1;
  display: flex;
  justify-content: center;
  -webkit-justify-content: center;
}
</style>
