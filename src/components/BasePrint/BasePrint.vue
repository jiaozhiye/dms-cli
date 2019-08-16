<script>
/**
 * @Author: 焦质晔
 * @Date: 2019/4/22
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-04-22 15:45:09
 **/
import { getLodop } from './LodopFuncs';

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
      this.createPrintPage(_html_);
    },
    createPrintPage(printHTML) {
      if (!this.LODOP) {
        this.LODOP = getLodop();
      }
      this.LODOP.PRINT_INIT('打印表格');
      if (this.direction === 'vertical') {
        if (this.alwaysPrint) {
          // 10mm -> 打印的下边距
          this.LODOP.SET_PRINT_PAGESIZE(3, '210mm', '10mm', '');
        } else {
          this.LODOP.SET_PRINT_PAGESIZE(1, '210mm', '297mm', '');
        }
      }
      if (this.direction === 'horizontal') {
        this.LODOP.SET_PRINT_PAGESIZE(2, '210mm', '297mm', '');
        this.LODOP.SET_SHOW_MODE('LANDSCAPE_DEFROTATED', 1);
      }
      this.LODOP.SET_PRINT_MODE('PRINT_PAGE_PERCENT', 'width: 100%'); // 设置打印内容的自动缩放
      this.LODOP.SET_PRINT_MODE('AUTO_CLOSE_PREWINDOW', 1); // 设置设置完打印后 是否关闭预览窗口;
      // 正则处理分页符，vue 的 template 把 page-break-after 改成了 break-after，
      // 因此需要替换回来
      const RegExp = /break-after:\s*page/g;
      const pageBreakStyle = 'page-break-after: always';
      this.LODOP.ADD_PRINT_HTM(0, 10, 'RightMargin: 5', 'BottomMargin: 5', printHTML.replace(RegExp, pageBreakStyle));
      this.LODOP.PREVIEW();
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
