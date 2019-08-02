<template>
  <div ref="print" style="width: 800px; margin: 0 auto;" v-show="isPreview">
    <table cellspacing="0" width="100%" style="border-collapse: collapse; border-spacing: 0;">
      <tr>
        <td align="right">
          <img src="@/assets/img/print-logo.jpg" />
        </td>
      </tr>
    </table>
    <table cellspacing="0" width="100%" style="border-collapse: collapse; border-spacing: 0;">
      <tr>
        <td colspan="7" align="center" height="24" style="font-size: 24px;">出库单</td>
      </tr>
      <tr>
        <td colspan="7" align="right" height="26" style="font-size: 14px;">打印时间：{{ nowTime }}&nbsp;</td>
      </tr>
      <tr>
        <td
          align="right"
          width="10%"
          height="26"
          style="border-top: 1px solid #000; font-size: 14px;"
        >出库单号：</td>
        <td style="border-top: 1px solid #000; font-size: 14px;">{{ data.ckdh }}</td>
        <td align="right" width="10%" style="border-top: 1px solid #000; font-size: 14px;">对应单号：</td>
        <td style="border-top: 1px solid #000; font-size: 14px;">{{ data.dydh }}</td>
        <td align="right" width="10%" style="border-top: 1px solid #000; font-size: 14px;">车型：</td>
        <td style="border-top: 1px solid #000; font-size: 14px;">{{ data.cx }}</td>
        <td width="8%" style="border-top: 1px solid #000; font-size: 14px;">领料出库</td>
      </tr>
      <tr>
        <td align="right" height="26" style="border-top: 1px solid #000; font-size: 14px;">客户名称：</td>
        <td style="border-top: 1px solid #000; font-size: 14px;">{{ data.khmc }}</td>
        <td align="right" style="border-top: 1px solid #000; font-size: 14px;">车牌号：</td>
        <td style="border-top: 1px solid #000; font-size: 14px;">{{ data.cph }}</td>
        <td align="right" style="border-top: 1px solid #000; font-size: 14px;">仓库库号：</td>
        <td style="border-top: 1px solid #000; font-size: 14px;">{{ data.ckkh }}</td>
        <td style="border-top: 1px solid #000; font-size: 14px;">一般领料</td>
      </tr>
    </table>
    <table cellspacing="0" width="100%" style="border-collapse: collapse; border-spacing: 0;">
      <tr>
        <td width="5%" height="26" style="border: 1px solid #000; font-size: 14px;">序号</td>
        <td width="20%" style="border: 1px solid #000; font-size: 14px;">备件代码</td>
        <td style="border: 1px solid #000; font-size: 14px;">备件名称</td>
        <td width="6%" style="border: 1px solid #000; font-size: 14px;">单位</td>
        <td width="10%" style="border: 1px solid #000; font-size: 14px;">出库单价</td>
        <td width="10%" style="border: 1px solid #000; font-size: 14px;">出库数量</td>
        <td width="10%" style="border: 1px solid #000; font-size: 14px;">结存数量</td>
        <td width="6%" style="border: 1px solid #000; font-size: 14px;">库区</td>
        <td width="6%" style="border: 1px solid #000; font-size: 14px;">库位</td>
        <td width="7%" style="border: 1px solid #000; font-size: 14px;">性质</td>
      </tr>
      <tr v-for="x in data.items" :key="x.id">
        <td height="24" style="border: 1px solid #000; font-size: 14px;">{{ x.id }}</td>
        <td style="border: 1px solid #000; font-size: 14px;">{{ x.bjdm }}</td>
        <td style="border: 1px solid #000; font-size: 14px;">{{ x.bjmc }}</td>
        <td style="border: 1px solid #000; font-size: 14px;">{{ x.dw }}</td>
        <td style="border: 1px solid #000; font-size: 14px;">{{ x.ckdj }}</td>
        <td style="border: 1px solid #000; font-size: 14px;">{{ x.cksl }}</td>
        <td style="border: 1px solid #000; font-size: 14px;">{{ x.jcsl }}</td>
        <td style="border: 1px solid #000; font-size: 14px;">{{ x.kq }}</td>
        <td style="border: 1px solid #000; font-size: 14px;">{{ x.kw }}</td>
        <td style="border: 1px solid #000; font-size: 14px;">{{ x.xz }}</td>
      </tr>
    </table>
    <table cellspacing="0" width="100%" style="border-collapse: collapse; border-spacing: 0;">
      <tr>
        <td align="right" width="8%" height="26" style="font-size: 14px;">总金额：</td>
        <td style="font-size: 14px;">{{ totalPrice }} 元</td>
        <td align="right" width="8%" style="font-size: 14px;">发料人：</td>
        <td style="font-size: 14px;">{{ data.flr }}</td>
        <td align="right" width="8%" style="font-size: 14px;">库管员：</td>
        <td style="font-size: 14px;">{{ data.kgy }}</td>
        <td align="right" width="10%" style="font-size: 14px;">领料人：</td>
        <td width="17%" style="font-size: 14px;">{{ data.llr }}</td>
      </tr>
      <tr>
        <td
          align="right"
          height="26"
          style="border-top: 1px solid #000; font-size: 14px;"
        >备&nbsp;&nbsp;&nbsp;&nbsp;注：</td>
        <td colspan="5" style="border-top: 1px solid #000; font-size: 14px;">{{ data.desc }}</td>
        <td align="right" style="border-top: 1px solid #000; font-size: 14px;">打印时间：</td>
        <td style="border-top: 1px solid #000; font-size: 14px;">{{ nowTime }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
/**
 * @Author: 焦质晔
 * @Date: 2019/4/22
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-04-22 15:45:09
 **/
import moment from 'moment';

export default {
  name: 'template1',
  props: {
    data: {
      type: Object,
      required: true,
      default() {
        return {};
      }
    },
    isPreview: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      nowTime: moment().format('YYYY-MM-DD HH:mm:ss')
    };
  },
  computed: {
    totalPrice() {
      return this.data.items.reduce((prev, curr) => {
        return curr.ckdj * curr.ckdj + prev;
      }, 0);
    }
  },
  methods: {
    fillInToDom() {
      this.isPreview = true;
    }
  },
  mounted() {
    this.$emit('onPrintTable', this.$refs.print.innerHTML);
    if (this.isPreview) {
      this.fillInToDom();
    }
  }
};
</script>
