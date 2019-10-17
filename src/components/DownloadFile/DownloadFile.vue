<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-05-06 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-08-18 12:02:51
 **/
import axios from '@/api/fetch';

export default {
  name: 'DownloadFile',
  props: {
    actionUrl: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      default: ''
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
      loading: false
    };
  },
  methods: {
    async clickHandle() {
      if (!this.actionUrl) return;
      try {
        this.loading = true;
        await this.downloadFile(this.actionUrl, this.params);
      } catch (err) {
        this.$emit('error', err);
        this.$message.error('文件下载失败！');
      }
      this.loading = false;
    },
    // 获取服务端文件 to blob
    async downLoadByUrl(url, params = {}) {
      return await axios({ url, params, responseType: 'blob' });
    },
    // 执行下载动作
    async downloadFile(url, params) {
      const { headers, data } = await this.downLoadByUrl(url, params);
      const contentDisposition = headers['content-disposition'];
      // 获取文件名
      const fileName = contentDisposition ? contentDisposition.split(';')[1].split('filename=')[1] : !this.fileName ? url.slice(url.lastIndexOf('/') + 1) : this.fileName;
      // ie10+
      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(data, decodeURI(fileName));
      } else {
        const downloadUrl = window.URL.createObjectURL(data);
        let a = document.createElement('a');
        a.href = downloadUrl;
        a.download = decodeURI(fileName);
        a.click();
        a = null;
      }
    }
  },
  render() {
    const { $attrs, $slots, loading, disabled } = this;
    const wrapProps = {
      props: {
        loading,
        disabled
      },
      attrs: {
        type: 'primary',
        ...$attrs
      },
      on: {
        click: this.clickHandle
      }
    };
    return <el-button {...wrapProps}>{$slots['default']}</el-button>;
  }
};
</script>
