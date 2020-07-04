/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-06-22 09:49:16
 **/
import { getLodop } from './LodopFuncs';
import css from './style.js';
import PropTypes from '../_utils/vue-types';
import PrefixCls from '../_utils/mixins/prefix-cls';

export default {
  name: 'BasePrint',
  mixins: [PrefixCls],
  props: {
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired, // 打印数据
    template: PropTypes.string.def(''),
    render: PropTypes.func.def(() => {}),
    printerType: PropTypes.string.def('laser'), // 默认激光打印机
    direction: PropTypes.string.def('vertical'), // 默认纵向打印
    printCopies: PropTypes.number, // 打印份数
    alwaysPrint: PropTypes.bool.def(false), // 连续打印
    directPrint: PropTypes.bool.def(false),
    isPreview: PropTypes.bool.def(false)
  },
  data() {
    this.LODOP = null;
    // 打印纸尺寸
    this.pageSize = this.printerType === 'laser' ? [2100, 2970] : [2400, 2800];
    return {
      state: 'stop'
    };
  },
  computed: {
    // unique key
    uniqueKey() {
      return `sheet-${+new Date()}`;
    },
    templatePath() {
      if (!this.template) return null;
      return this.template.endsWith('.vue') ? this.template : `${this.template}.vue`;
    }
  },
  created() {
    // 动态加载组件
    this.$options.component = this.templatePath ? () => import(`@/pages/printTemplate/${this.templatePath}`) : this.render;
  },
  destroyed() {
    // 释放内存
    this.LODOP = null;
  },
  methods: {
    getPrintTable(_html_) {
      // 添加打印单头部 logo
      _html_ = this.createPrintLogo(_html_);
      // 处理分页符
      _html_ = this.createPageBreak(_html_);
      // 加载全局 style 样式
      _html_ = this.createGlobalStyle(_html_);
      // 页面预览
      if (this.isPreview) {
        this.createPreviewNodes(_html_);
      } else {
        // 执行打印
        this.createPrintPage(_html_);
      }
    },
    createPrintPage(printHTML) {
      if (!this.LODOP) {
        this.LODOP = getLodop();
      }
      if (!this.LODOP) return;
      this.LODOP.PRINT_INIT(this.uniqueKey);
      // 纵向
      if (this.direction === 'vertical') {
        // 按内容走纸，连续打印
        if (this.alwaysPrint) {
          this.LODOP.SET_PRINT_PAGESIZE(3, this.pageSize[0], 90, ''); // 9mm -> 打印的下边距
        } else {
          // 整张打印
          this.LODOP.SET_PRINT_PAGESIZE(1, this.pageSize[0], this.pageSize[1], '');
        }
      }
      // 横向
      if (this.direction === 'horizontal') {
        this.LODOP.SET_PRINT_PAGESIZE(2, this.pageSize[0], this.pageSize[1], '');
        this.LODOP.SET_SHOW_MODE('LANDSCAPE_DEFROTATED', 1);
      }
      this.LODOP.SET_PRINT_MODE('PRINT_PAGE_PERCENT', 'Full-Width'); // 设置打印内容的自动缩放
      this.LODOP.SET_PRINT_MODE('AUTO_CLOSE_PREWINDOW', 1); // 设置设置完打印后 是否关闭预览窗口;
      if (typeof this.printCopies !== 'undefined') {
        this.LODOP.SET_PRINT_COPIES(this.printCopies); // 指定打印份数
      }
      // ADD_PRINT_TABLE -> 分页时可固定 页眉/页脚
      this.LODOP.ADD_PRINT_HTM(0, 0, 'RightMargin: 0', 'BottomMargin: 0', printHTML);
      !this.directPrint ? this.LODOP.PREVIEW() : this.LODOP.PRINT(); // 直接打印
    },
    createGlobalStyle(_html_) {
      return '<!DOCTYPE html><html>' + '<head><meta charset="utf-8" />' + css.style + '</head>' + '<body>' + _html_ + '</body></html>';
    },
    createPrintLogo(_html_) {
      // 如果出现图片加载的问题，换成 base64 格式
      const logoHtml = `
        <table>
          <tr>
            <td width="50%" align="left" style="padding: 16px;">
              <img src="/static/img/logo_l.png" border="0" height="26" />
            </td>
            <td width="50%" align="right" style="padding: 16px;">
              <img src="/static/img/logo_r.png" border="0" height="36" />
            </td>
          </tr>
        </table>
      `;
      return logoHtml + _html_;
    },
    createPageBreak(_html_) {
      // 正则处理分页符，vue 的 template 把 page-break-after 改成了 break-after，
      // 因此需要替换回来
      const RegExp = /break-after:\s*page/g;
      const pageBreakMark = `page-break-after: always`;
      return _html_.replace(RegExp, pageBreakMark);
    },
    createPrintComponent(h) {
      return h(this.$options.component, {
        props: {
          data: this.data
        },
        on: {
          onPrintTable: this.getPrintTable
        }
      });
    },
    createPreviewNodes(_html_) {
      const $target = document.body.querySelector('.v-lodop-print--preview');
      if (!$target) {
        let $wrapper = document.createElement('div');
        $wrapper.className = 'v-lodop-print--preview';
        $wrapper.innerHTML = _html_;
        document.body.appendChild($wrapper);
        $wrapper = null;
      } else {
        $target.innerHTML = _html_;
      }
    },
    EXCUTE_PRINT() {
      this.state = 'start';
      setTimeout(() => (this.state = 'stop'), 500);
    }
  },
  render(h) {
    const prefixCls = this.getPrefixCls('lodop-print--wrapper');
    const cls = {
      [prefixCls]: true
    };
    const vNode = this.state === 'start' ? this.createPrintComponent(h) : null;
    return <div class={cls}>{vNode}</div>;
  }
};
