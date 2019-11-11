<template>
  <div :class="{ fullscreen: fullscreen }" class="tinymce-container">
    <textarea :id="tinymceId" class="tinymce-textarea" />
    <div v-if="isUploadImage" class="editor-custom-btn-container">
      <UploadImg class="editor-upload-btn" :action-url="actionUrl" :fixed-size="fixedSize" @success="imageSuccessHandle" />
    </div>
  </div>
</template>

<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 10:00:00
 **/
import plugins from './plugins';
import toolbar from './toolbar';
import UploadImg from './UploadImg';

import { messageAction } from '@/utils';

export default {
  name: 'Tinymce',
  components: {
    UploadImg
  },
  props: {
    id: {
      type: String,
      default() {
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '');
      }
    },
    value: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 450
    },
    actionUrl: {
      type: String,
      required: true,
      default: ''
    },
    fixedSize: {
      type: Array,
      default() {
        return [5, 4];
      }
    },
    wordsLimit: {
      type: Number,
      default: 50000
    },
    isUploadImage: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
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
    this.tinymce = null;
    this.tinymceVal;
    return {
      tinymceId: this.id,
      fullscreen: false
    };
  },
  watch: {
    value: {
      handler(val = '') {
        if (val === this.tinymceVal || !this.tinymce) return;
        this.tinymce.setContent(val);
      },
      immediate: true
    }
  },
  mounted() {
    this.tinymce = this.initTinymce();
  },
  activated() {
    this.tinymce = this.initTinymce();
  },
  deactivated() {
    this.destroyTinymce();
  },
  destroyed() {
    this.destroyTinymce();
  },
  methods: {
    initTinymce() {
      window.tinymce.init({
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
        readonly: this.disabled,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        init_instance_callback: editor => {
          // 初始化内容
          this.value && editor.setContent(this.value);
          // change 事件
          editor.on('Change', e => {
            if (this.isWordsLimit) {
              this.setContent(e.lastLevel.content);
              this.syncTinymceVal(e.lastLevel.content);
            }
            this.isWordsLimit = false;
          });
          // keyup 事件
          editor.on('KeyUp', e => {
            const val = editor.getContent();
            if (this.tinymceVal === val) return;
            // 过滤 html 标签
            const regExp = /<[^<>]+>/g;
            if (val.replace(regExp, '').length > this.wordsLimit) {
              this.isWordsLimit = true;
              return messageAction('文字数量已达上限！', 'warning');
            }
            // 重点
            this.syncTinymceVal(val);
          });
        },
        setup(editor) {
          editor.on('FullscreenStateChanged', e => {
            this.fullscreen = e.state;
          });
        }
      });
      return window.tinymce.get(this.tinymceId);
    },
    syncTinymceVal(val) {
      this.tinymceVal = val;
      this.$emit('input', val);
      this.$emit('change', val);
    },
    destroyTinymce() {
      if (this.fullscreen) {
        this.tinymce.execCommand('mceFullScreen');
      }
      this.tinymce.destroy();
    },
    setContent(val) {
      this.tinymceVal = val;
      this.tinymce.setContent(val);
    },
    getContent() {
      this.tinymce.getContent();
    },
    imageSuccessHandle(arr) {
      arr.forEach(v => {
        this.tinymce.insertContent(`<img class="wscnph" src="${v.url}" />`);
      });
    }
  }
};
</script>

<style lang="less" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
  /deep/ .mce-fullscreen {
    z-index: 9999;
  }
  /deep/ .tox-statusbar__wordcount {
    display: none;
  }
  /deep/ .tox-statusbar__branding {
    display: none;
  }
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.editor-custom-btn-container {
  position: absolute;
  right: 6px;
  top: 6px;
  .editor-upload-btn {
    display: inline-block;
  }
}
.fullscreen .editor-custom-btn-container {
  position: fixed;
  z-index: 9999;
}
</style>
