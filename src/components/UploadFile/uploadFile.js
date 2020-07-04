/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-01 19:37:16
 **/
import axios from 'axios';
import { cloneDeep } from 'lodash';
import { Message } from 'element-ui';
import PropTypes from '../_utils/vue-types';
import Locale from '../_utils/mixins/locale';
import PrefixCls from '../_utils/mixins/prefix-cls';

export default {
  name: 'UploadFile',
  mixins: [Locale, PrefixCls],
  props: {
    actionUrl: PropTypes.string.isRequired,
    headers: PropTypes.object.def({}),
    initialValue: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        url: PropTypes.string
      })
    ).def([]),
    fileTypes: PropTypes.array.def(['jpg', 'png', 'pdf', 'xls', 'xlsx']),
    isOnlyButton: PropTypes.bool.def(false),
    limit: PropTypes.number.def(1),
    fileSize: PropTypes.number.def(5),
    params: PropTypes.object.def({}),
    disabled: PropTypes.bool.def(false),
    containerStyle: PropTypes.object.def({})
  },
  data() {
    return {
      fileList: this.initialValue
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
  methods: {
    beforeUploadHandle(file) {
      const isType = this.fileTypes.includes(file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase());
      const isLt5M = file.size / 1024 / 1024 < this.fileSize;
      if (!isType) {
        Message.warning(this.t('uploadFile.tooltip', { type: this.fileTypes.join(',') }));
      }
      if (!isLt5M) {
        Message.warning(this.t('uploadFile.sizeLimit', { size: this.fileSize }));
      }
      return isType && isLt5M;
    },
    removeFileHandle(file, fileList) {
      this.fileList = fileList;
    },
    successHandle(res, file, fileList) {
      if (res.code === 200) {
        this.fileList = [...this.fileList, { name: file.name, url: res.data || '' }];
        this.$emit('success', res.data);
      }
    },
    errorHandle(err) {
      this.$emit('error', err);
      this.$message.error(this.t('uploadFile.uploadError'));
    },
    async previewFileHandle(file) {
      try {
        await this.downloadFile(file);
      } catch (err) {
        this.$message.error(this.t('uploadFile.downError'));
      }
    },
    // 获取服务端文件 to blob
    async downLoadByUrl(url, params = {}) {
      const { data } = await axios({ url, params, headers: this.headers, responseType: 'blob' });
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
        headers: $props.headers,
        data: $props.params,
        fileList: cloneDeep(fileList),
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
        icon: 'iconfont icon-upload',
        ...$attrs
      }
    };
    return (
      <el-upload ref="upload" {...wrapProps}>
        <el-button {...btnProps}>{$slots['default']}</el-button>
        {!$props.isOnlyButton ? (
          <div slot="tip" class="el-upload__tip" style="line-height: 1.5">
            {`${this.t('uploadFile.tooltip', { type: fileTypes.join(',') })}，${this.t('uploadFile.sizeLimit', { size: fileSize })}`}
          </div>
        ) : null}
      </el-upload>
    );
  }
};
