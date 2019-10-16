<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-05-06 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-08-18 12:02:51
 **/
export default {
  name: 'UploadFile',
  props: {
    actionUrl: {
      type: String,
      required: true
    },
    initialValue: {
      type: Array,
      default: () => []
    },
    fileTypes: {
      type: Array,
      default: () => ['jpg', 'png', 'pdf', 'doc']
    },
    isOnlyButton: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 1
    },
    params: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileList: this.initialValue
    };
  },
  watch: {
    fileList(val) {
      this.$emit('change', val);
    }
  },
  methods: {
    beforeUploadHandle(file) {
      const isType = this.fileTypes.includes(file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase());
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isType) {
        this.$notify({ title: '警告信息', message: `上传头像图片只能是 ${this.fileTypes.join(',')} 格式!`, type: 'warning' });
      }
      if (!isLt5M) {
        this.$notify({ title: '警告信息', message: '上传附件大小不能超过 5MB!', type: 'warning' });
      }
      return isType && isLt5M;
    },
    removeFileHandle(file, fileList) {
      this.fileList = fileList;
    },
    successHandle(res, file, fileList) {
      if (res.resultCode === 200) {
        this.fileList = [...this.fileList, { name: file.name, url: res.data || '' }];
      }
    },
    errorHandle(err) {
      this.$emit('error', err);
      this.$message.error('上传文件失败！');
    },
    async previewFileHandle() {
      this.downloadFile(file.url);
    },
    // 获取服务端文件 to blob
    async downLoadByUrl(url, params = {}) {
      const { data } = await axios({ url, params, responseType: 'blob' });
      return data;
    },
    // 执行下载动作
    async downloadFile(url, params) {
      const blob = await this.downLoadByUrl(url, params);
      const fileName = url.slice(url.lastIndexOf('/') + 1);
      // ie10+
      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, fileName);
      } else {
        const downloadUrl = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileName;
        a.click();
        a = null;
      }
    }
  },
  render() {
    const { $props, $listeners, fileList, fileTypes } = this;
    const wrapProps = {
      props: {
        action: $props.actionUrl,
        data: $props.params,
        fileList,
        limit: $props.limit,
        showFileList: !$props.isOnlyButton,
        multiple: false,
        withCredentials: true,
        onPreview: this.previewFileHandle,
        beforeUpload: this.beforeUploadHandle,
        onRemove: this.removeFileHandle,
        onSuccess: this.successHandle,
        onError: this.errorHandle
      },
      on: $listeners
    };
    return (
      <div>
        <el-upload ref="upload" {...wrapProps}>
          <el-button size="small" type="primary">
            点击上传
          </el-button>
          {!$props.isOnlyButton ? (
            <div slot="tip" class="el-upload__tip">
              {`只能上传 ${fileTypes.join(',')} 格式，文件大小不超过5M`}
            </div>
          ) : null}
        </el-upload>
      </div>
    );
  }
};
</script>
