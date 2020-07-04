/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-25 18:43:05
 **/
import axios from 'axios';
import PropTypes from '../_utils/vue-types';
import Locale from '../_utils/mixins/locale';

export default {
  name: 'DownloadFile',
  mixins: [Locale],
  props: {
    actionUrl: PropTypes.string.isRequired,
    headers: PropTypes.object.def({}),
    fileName: PropTypes.string.def(''),
    params: PropTypes.object.def({}),
    disabled: PropTypes.bool.def(false)
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
        this.$emit('success');
      } catch (err) {
        this.$emit('error', err);
        this.$message.error(this.t('downLoadFile.error'));
      }
      this.loading = false;
    },
    // 获取服务端文件 to blob
    async downLoadByUrl(url, params = {}) {
      return await axios({ url, params, headers: this.headers, responseType: 'blob' });
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
        ...$attrs,
        icon: 'el-icon-download'
      },
      on: {
        click: this.clickHandle
      }
    };
    return <el-button {...wrapProps}>{$slots['default']}</el-button>;
  }
};
