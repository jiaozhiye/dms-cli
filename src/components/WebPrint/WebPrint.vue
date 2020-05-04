<script>
/*
 * @Author: 焦质晔
 * @Date: 2020-02-15 14:03:56
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-04 18:27:37
 */
import { notifyAction } from '@/utils';
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
        return notifyAction(this.$t('webPrint.noData'), 'warning');
      }
      const extname = file.slice(file.lastIndexOf('.') + 1).toLowerCase();
      if (extname !== 'pdf') {
        return notifyAction(this.$t('webPrint.error'), 'warning');
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
        title: this.$t('webPrint.preview'),
        width: '80%',
        destroyOnClose: true
      },
      on: {
        'update:visible': val => (this.visible = val)
      }
    };
    return (
      <div class="v-web-print el-button">
        <el-button {...btnProps}>{$slots['default']}</el-button>
        <BaseDialog {...wrapProps}>
          <iframe class="v-web-print--preview" src={filePath} />
        </BaseDialog>
      </div>
    );
  }
};
</script>

<style lang="scss" scoped>
.v-web-print {
  display: inline-block;
  padding: 0;
  border: 0;
}
.v-web-print--preview {
  display: block;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  min-height: calc(80vh - 80px);
  border: 0;
}
</style>
