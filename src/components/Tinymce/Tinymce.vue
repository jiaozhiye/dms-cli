<template>
  <div :class="{fullscreen: fullscreen}" class="tinymce-container editor-container">
    <textarea :id="tinymceId" class="tinymce-textarea" />
    <div class="editor-custom-btn-container">
      <UploadImg class="editor-upload-btn" :actionUrl="actionUrl" @successCBK="imageSuccessCBK" />
    </div>
  </div>
</template>

<script>
import plugins from './plugins';
import toolbar from './toolbar';
import UploadImg from './UploadImg';

export default {
  name: 'Tinymce',
  components: { UploadImg },
  props: {
    id: {
      type: String,
      default: function() {
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '');
      }
    },
    value: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 360
    },
    actionUrl: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      default() {
        return [];
      }
    },
    menubar: {
      type: String,
      default: 'file edit insert view format table'
    }
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false
    };
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() => window.tinymce.get(this.tinymceId).setContent(val || ''));
      }
    }
  },
  mounted() {
    this.initTinymce();
  },
  activated() {
    this.initTinymce();
  },
  deactivated() {
    this.destroyTinymce();
  },
  destroyed() {
    this.destroyTinymce();
  },
  methods: {
    initTinymce() {
      tinymce.init({
        language: 'zh_CN',
        selector: `#${this.tinymceId}`,
        height: this.height,
        body_class: 'panel-body ',
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        plugins: plugins,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        default_link_target: '_blank',
        link_title: false,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        init_instance_callback: editor => {
          if (this.value) {
            editor.setContent(this.value);
          }
          this.hasInit = true;
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true;
            this.$emit('input', editor.getContent());
            this.$emit('change', editor.getContent());
          });
        },
        setup(editor) {
          editor.on('FullscreenStateChanged', e => {
            this.fullscreen = e.state;
          });
        }
      });
    },
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId);
      if (this.fullscreen) {
        tinymce.execCommand('mceFullScreen');
      }
      if (tinymce) {
        tinymce.destroy();
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value);
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent();
    },
    imageSuccessCBK(arr) {
      arr.forEach(v => {
        window.tinymce.get(this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`);
      });
    }
  }
};
</script>

<style lang="less" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}
.tinymce-container {
  /deep/.mce-fullscreen {
    z-index: 10000;
  }
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
}
.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}
.editor-upload-btn {
  display: inline-block;
}
</style>
