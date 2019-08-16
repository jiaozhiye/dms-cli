<template>
  <div class="upload-container">
    <el-button icon="el-icon-upload" size="mini" type="primary" @click="dialogVisible=true">上传图片</el-button>
    <BaseDialog
      :visible.sync="dialogVisible"
      destroyOnClose
      :containerStyle="{height: 'calc(100% - 60px)', overflow: 'auto', paddingBottom: '60px'}"
    >
      <div>
        <el-upload
          class="editor-slide-upload"
          :action="actionUrl"
          list-type="picture-card"
          :file-list="fileList"
          :multiple="true"
          :show-file-list="true"
          :with-credentials="true"
          :on-success="handleSuccess"
          :before-upload="beforeUpload"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
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
export default {
  name: 'UploadImg',
  props: ['actionUrl'],
  data() {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: []
    };
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess);
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v]);
      if (!this.checkAllSuccess()) {
        this.$message('可能出现了网络问题，请刷新页面重新上传！');
        return;
      }
      this.$emit('successCBK', arr);
      this.listObj = {};
      this.fileList = [];
      this.dialogVisible = false;
    },
    handleSuccess(response, file) {
      const uid = file.uid;
      const objKeyArr = Object.keys(this.listObj);
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = response.data;
          this.listObj[objKeyArr[i]].hasSuccess = true;
          return;
        }
      }
    },
    handleRemove(file) {
      const uid = file.uid;
      const objKeyArr = Object.keys(this.listObj);
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]];
          return;
        }
      }
    },
    beforeUpload(file) {
      const _self = this;
      const _URL = window.URL || window.webkitURL;
      const fileName = file.uid;
      this.listObj[fileName] = {};
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = _URL.createObjectURL(file);
        img.onload = function() {
          _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height };
        };
        resolve(true);
      });
    }
  }
};
</script>

<style lang="less" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  /deep/.el-upload--picture-card {
    width: 100%;
  }
}
</style>
