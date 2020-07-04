/*
 * @Author: 焦质晔
 * @Date: 2020-02-15 14:03:56
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-25 17:10:34
 */
import { Message } from 'element-ui';
import PropTypes from '../_utils/vue-types';
import { isIE } from '../_utils/tool';
import Locale from '../_utils/mixins/locale';
import PrefixCls from '../_utils/mixins/prefix-cls';
import BaseDialog from '../BaseDialog';

export default {
  name: 'WebPrint',
  mixins: [Locale, PrefixCls],
  props: {
    fileUrl: PropTypes.string.def(''),
    click: PropTypes.func
  },
  data() {
    return {
      visible: false,
      loading: false,
      filePath: ''
    };
  },
  methods: {
    createIframeUrl(path = '') {
      if (!path) return;
      if (!isIE()) {
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
        return Message.warning(this.t('webPrint.noData'));
      }
      const extname = file.slice(file.lastIndexOf('.') + 1).toLowerCase();
      if (extname !== 'pdf') {
        return Message.warning(this.t('webPrint.error'));
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
        title: this.t('webPrint.preview'),
        width: '80%',
        destroyOnClose: true
      },
      on: {
        'update:visible': val => (this.visible = val)
      }
    };
    const prefixCls = this.getPrefixCls('web-print--preview');
    const cls = {
      [prefixCls]: true
    };
    return (
      <el-button {...btnProps}>
        {$slots['default']}
        <BaseDialog {...wrapProps}>
          <iframe class={cls} src={filePath} />
        </BaseDialog>
      </el-button>
    );
  }
};
