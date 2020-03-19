<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-19 11:15:37
 **/
import { getLodop } from './LodopFuncs';
import css from './assets/style.module.js';

export default {
  name: 'BasePrint',
  props: {
    template: {
      type: String,
      required: true,
      default: ''
    },
    printerType: {
      type: String,
      default: 'laser' // 默认激光打印机
    },
    direction: {
      type: String,
      default: 'vertical'
    },
    printCopies: {
      type: Number
    },
    alwaysPrint: {
      type: Boolean,
      default: false
    },
    directPrint: {
      type: Boolean,
      default: false
    },
    data: {
      type: [Object, Array],
      required: true
    },
    isPreview: {
      type: Boolean,
      default: false
    }
  },
  data() {
    // 打印纸尺寸
    this.pageSize = this.printerType === 'laser' ? [2100, 2970] : [2400, 2800];
    return {
      LODOP: null,
      state: 'stop'
    };
  },
  computed: {
    // unique key
    uniqueKey() {
      return `打印单-${+new Date()}`;
    },
    templatePath() {
      return this.template.endsWith('.vue') ? this.template : `${this.template}.vue`;
    }
  },
  created() {
    // 动态加载组件
    this.$options.component = () => import(`@/pages/printTemplate/${this.templatePath}`);
  },
  beforeDestroy() {
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
      // this.LODOP.SET_PRINT_STYLEA(0, 'HtmWaitMilSecs', 100);
      !this.directPrint ? this.LODOP.PREVIEW() : this.LODOP.PRINT(); // 直接打印
    },
    createGlobalStyle(_html_) {
      return css.style + '<body>' + _html_ + '</body>';
    },
    createPrintLogo(_html_) {
      const logoHtml = `
        <table>
          <tr>
            <td width="50%" align="left" style="padding: 16px;">
              <img src="/static/img/logo_l.png" border="0" width="120" />
            </td>
            <td width="50%" align="right" style="padding: 16px;">
              <img src="/static/img/logo_r.png" border="0" width="240" height="36" />
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
      const $target = document.body.querySelector('.preview-wrap');
      if (!$target) {
        let $wrapper = document.createElement('div');
        $wrapper.className = 'preview-wrap';
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
    const vNode = this.state === 'start' ? this.createPrintComponent(h) : null;
    return <div class="print-wrap">{vNode}</div>;
  }
};
</script>

<style lang="less">
.print-wrap {
  display: none;
  visibility: hidden;
}
.preview-wrap {
  width: 960px;
  padding: 10px;
  border: 1px solid @borderColor;
  margin: 0 auto;
}
</style>
