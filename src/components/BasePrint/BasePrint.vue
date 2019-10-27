<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 10:00:00
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
    direction: {
      type: String,
      default: 'vertical'
    },
    alwaysPrint: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      required: true,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      LODOP: getLodop(),
      state: 'stop'
    };
  },
  methods: {
    getPrintTable(_html_) {
      // 加载全局 style 样式
      _html_ = this.createGlobalStyle(_html_);
      // 处理分页符
      _html_ = this.createPrintLogo(_html_);
      _html_ = this.createPageBreak(_html_);
      // 执行打印
      this.createPrintPage(_html_);
    },
    createPrintPage(printHTML) {
      if (!this.LODOP) {
        this.LODOP = getLodop();
      }
      if (!this.LODOP) return;
      this.LODOP.PRINT_INIT('打印表格');
      // 纵向
      if (this.direction === 'vertical') {
        if (this.alwaysPrint) {
          // 10mm -> 打印的下边距
          this.LODOP.SET_PRINT_PAGESIZE(3, '210mm', '10mm', '');
        } else {
          this.LODOP.SET_PRINT_PAGESIZE(1, '210mm', '297mm', '');
        }
      }
      // 横向
      if (this.direction === 'horizontal') {
        this.LODOP.SET_PRINT_PAGESIZE(2, '210mm', '297mm', '');
        this.LODOP.SET_SHOW_MODE('LANDSCAPE_DEFROTATED', 1);
      }
      this.LODOP.SET_PRINT_MODE('PRINT_PAGE_PERCENT', 'width: 100%'); // 设置打印内容的自动缩放
      this.LODOP.SET_PRINT_MODE('AUTO_CLOSE_PREWINDOW', 1); // 设置设置完打印后 是否关闭预览窗口;
      this.LODOP.ADD_PRINT_HTM(0, 0, 'RightMargin: 0', 'BottomMargin: 0', printHTML);
      this.LODOP.PREVIEW();
    },
    createGlobalStyle(_html_) {
      return css.style + _html_;
    },
    createPrintLogo(_html_) {
      const logoHtml = `
        <table>
          <tr>
            <td width="50%" align="left" style="padding-top: 20px; padding-bottom: 20px;">
              <img src="/static/img/logo_l.png" width="150" style="margin-left: 20px;" />
            </td>
            <td width="50%" align="right" style="padding-top: 20px; padding-bottom: 20px;">
              <img src="/static/img/logo_r.png" width="300" style="margin-right: 20px;" />
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
          data: this.data,
          isPreview: false
        },
        on: {
          onPrintTable: this.getPrintTable
        }
      });
    },
    EXCUTE_PRINT() {
      this.state = 'start';
      setTimeout(() => (this.state = 'stop'), 500);
    }
  },
  created() {
    // 动态加载组件
    this.$options.component = () => import(`@/pages/printTemplate/${this.template}.vue`);
  },
  beforeDestroy() {
    // 释放内存
    this.LODOP = null;
  },
  render(h) {
    const vNode = this.state === 'start' ? this.createPrintComponent(h) : null;
    return <div class="print-wrap">{vNode}</div>;
  }
};
</script>

<style lang="less" scoped>
.print-wrap {
  visibility: hidden;
}
</style>
