<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-06-20 10:00:00
 **/
import axios, { getConfigHeaders } from '@/api/fetch';

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
      default: () => ['jpg', 'png', 'pdf', 'xls']
    },
    isOnlyButton: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 1
    },
    fileSize: {
      type: Number,
      default: 5
    },
    params: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    },
    containerStyle: {
      type: Object,
      default: () => ({})
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
      const isLt5M = file.size / 1024 / 1024 < this.fileSize;
      if (!isType) {
        this.$notify({ title: '提示信息', message: `上传的文件只能是 ${this.fileTypes.join(',')} 格式！`, type: 'warning' });
      }
      if (!isLt5M) {
        this.$notify({ title: '提示信息', message: `上传文件大小不能超过 ${this.fileSize}M！`, type: 'warning' });
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
      this.$message.error('文件上传失败！');
    },
    async previewFileHandle(file) {
      try {
        await this.downloadFile(file);
      } catch (err) {
        this.$message.error('文件下载失败！');
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
  },
  render() {
    const { $props, $attrs, $slots, $listeners, fileList, fileTypes, fileSize, containerStyle } = this;
    const wrapProps = {
      props: {
        action: $props.actionUrl,
        headers: getConfigHeaders(),
        data: $props.params,
        fileList,
        limit: $props.limit,
        showFileList: !$props.isOnlyButton,
        multiple: false,
        withCredentials: true,
        disabled: $props.disabled,
        onPreview: this.previewFileHandle,
        beforeUpload: this.beforeUploadHandle,
        onRemove: this.removeFileHandle,
        onSuccess: this.successHandle,
        onError: this.errorHandle
      },
      on: $listeners
    };
    const btnProps = {
      attrs: {
        type: 'primary',
        ...$attrs
      }
    };
    return (
      <div class="upload-btn" style={containerStyle}>
        <el-upload ref="upload" {...wrapProps}>
          <el-button {...btnProps}>{$slots['default']}</el-button>
          {!$props.isOnlyButton ? (
            <div slot="tip" class="el-upload__tip">
              {`只能上传 ${fileTypes.join(',')} 格式，文件大小不超过${fileSize}M`}
            </div>
          ) : null}
        </el-upload>
      </div>
    );
  }
};
</script>

<style lang="less" scoped>
.upload-btn {
  display: inline-block;
}
</style>
