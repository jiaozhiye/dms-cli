<script>
/*
 * @Author: 焦质晔
 * @Date: 2020-02-15 14:03:56
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-02-15 18:04:02
 */
import { Notification } from 'element-ui';
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue';

export default {
  name: 'WebPrint',
  props: {
    fileUrl: {
      type: String,
      default: ''
    },
    click: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      filePath: ''
    };
  },
  methods: {
    isIE() {
      return !!window.ActiveXObject || 'ActiveXObject' in window;
    },
    createIframeUrl(path = '') {
      if (!path) return;
      if (!this.isIE()) {
        return path;
      }
      return `/static/webPrint/pdf/web/viewer.html?file=${path}`;
    },
    async clickHandle() {
      let file = this.fileUrl;
      if (this.click) {
        this.loading = true;
        try {
          file = await this.click();
        } catch (err) {}
        this.loading = false;
      }
      // 处理路径
      file = this.createIframeUrl(file);
      if (!file) {
        return Notification({ type: 'warning', title: '提示信息', message: 'pdf 文件未载入，无法打印！' });
      }
      const extname = file.slice(file.lastIndexOf('.') + 1).toLowerCase();
      if (extname !== 'pdf') {
        return Notification({ type: 'warning', title: '提示信息', message: '文件格式有误，无法打印！' });
      }
      this.filePath = file;
      this.visible = true;
    }
  },
  render() {
    const { $props, $listeners, $attrs, $slots, visible, loading, filePath } = this;
    const btnProps = {
      props: {
        ...$props,
        loading
      },
      attrs: {
        ...$attrs,
        icon: 'el-icon-printer'
      },
      on: {
        click: this.clickHandle
      }
    };
    const wrapProps = {
      props: {
        visible,
        title: '打印预览',
        width: '80%',
        destroyOnClose: true
      },
      on: {
        'update:visible': val => (this.visible = val)
      }
    };
    return (
      <div class="print-btn el-button">
        <el-button {...btnProps}>{$slots['default'] || '打印'}</el-button>
        <BaseDialog {...wrapProps}>
          <iframe class="preview-wrap" src={filePath} />
        </BaseDialog>
      </div>
    );
  }
};
</script>

<style lang="less" scoped>
.print-btn {
  display: inline-block;
  padding: 0;
  border: 0;
}
.preview-wrap {
  display: block;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  min-height: calc(80vh - 80px);
  border: 0;
}
</style>
