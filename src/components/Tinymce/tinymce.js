/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-06-29 09:20:22
 **/
import Editor from './lib';
import UploadImage from './UploadImage';
import PropTypes from '../_utils/vue-types';
import Locale from '../_utils/mixins/locale';
import PrefixCls from '../_utils/mixins/prefix-cls';

export default {
  name: 'Tinymce',
  components: {
    Editor,
    UploadImage
  },
  mixins: [Locale, PrefixCls],
  props: {
    id: PropTypes.string.def('vue-tinymce-' + +new Date()),
    value: PropTypes.string,
    height: PropTypes.number.def(400),
    upload: PropTypes.shape({
      actionUrl: PropTypes.string.isRequired,
      headers: PropTypes.object.def({}),
      fixedSize: PropTypes.array.def([5, 4])
    }),
    disabled: PropTypes.bool.def(false),
    plugins: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).def('lists image link media table textcolor wordcount contextmenu fullscreen'),
    toolbar: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).def(
      'undo redo |  formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists link unlink image media table | removeformat | fullscreen'
    )
  },
  data() {
    return {
      content: this.value,
      initial: {
        height: this.height,
        plugins: this.plugins,
        toolbar: this.toolbar,
        language: 'zh_CN',
        menubar: false,
        images_upload_handler: (blobInfo, success, failure) => {
          let formData = new FormData();
          formData.append('file', blobInfo.blob(), blobInfo.filename());
          let img = `data:image/jpeg;base64,${blobInfo.base64()}`;
          success(img);
        }
      }
    };
  },
  watch: {
    value(val) {
      this.content = val;
    }
  },
  methods: {
    successHandle(arr) {
      arr.forEach(v => {
        this.content += `<img class="wscnph" src="${v.url}" />`;
      });
    }
  },
  render() {
    const { initial, content, disabled, upload = {} } = this;
    const prefixCls = this.getPrefixCls('tinymce--wrapper');
    const cls = {
      [prefixCls]: true
    };
    return (
      <div class={cls}>
        <editor
          init={initial}
          tinymceScriptSrc="/static/tinymce/tinymce.min.js"
          value={content}
          onInput={val => {
            this.content = val;
            this.$emit('input', val);
            this.$emit('change', val);
          }}
          disabled={disabled}
        />
        {!!upload.actionUrl && (
          <div class="editor-custom-btn-container">
            <UploadImage class="editor-upload-btn" action-url={upload.actionUrl} headers={upload.headers} fixed-size={upload.fixedSize} onSuccess={this.successHandle} />
          </div>
        )}
      </div>
    );
  }
};
