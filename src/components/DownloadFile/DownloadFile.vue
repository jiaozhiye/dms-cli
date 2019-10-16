<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-05-06 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-08-18 12:02:51
 **/
export default {
  name: 'DownloadFile',
  props: {
    actionUrl: {
      type: String,
      required: true
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
    const { $slots, loading, disabled } = this;
    return (
      <el-button type="primary" icon="el-icon-download" loading={loading} disabled={disabled} onClick={this.clickHandle}>
        {$slots['default']}
      </el-button>
    );
  }
};
</script>
