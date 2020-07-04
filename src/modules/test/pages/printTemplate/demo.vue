<template>
  <div v-show="false" ref="print" style="width:100%; margin: 0 auto;">
    <table class="fs14">
      <tr>
        <td colspan="7" align="center" style="font-size: 24px;">出库单</td>
      </tr>
      <tr>
        <td colspan="7" align="right">打印时间：{{ nowTime }}&nbsp;</td>
      </tr>
      <tr>
        <td align="right" width="10%">出库单号：</td>
        <td>{{ data.ckdh }}</td>
        <td align="right" width="10%">对应单号：</td>
        <td>{{ data.dydh }}</td>
        <td align="right" width="10%">车型：</td>
        <td>{{ data.cx }}</td>
        <td width="8%">领料出库</td>
      </tr>
      <tr>
        <td align="right">客户名称：</td>
        <td>{{ data.khmc }}</td>
        <td align="right">车牌号：</td>
        <td>{{ data.cph }}</td>
        <td align="right">仓库库号：</td>
        <td>{{ data.ckkh }}</td>
        <td>一般领料</td>
      </tr>
    </table>

    <table class="bor fs14">
      <tr>
        <td width="5%">序号</td>
        <td width="20%">备件代码</td>
        <td>备件名称</td>
        <td width="6%">单位</td>
        <td width="10%">出库单价</td>
        <td width="10%">出库数量</td>
        <td width="10%">结存数量</td>
        <td width="6%">库区</td>
        <td width="6%">库位</td>
        <td width="7%">性质</td>
      </tr>
      <tr v-for="x in data.items" :key="x.id">
        <td>{{ x.id }}</td>
        <td>{{ x.bjdm }}</td>
        <td>{{ x.bjmc }}</td>
        <td>{{ x.dw }}</td>
        <td>{{ x.ckdj }}</td>
        <td>{{ x.cksl }}</td>
        <td>{{ x.jcsl }}</td>
        <td>{{ x.kq }}</td>
        <td>{{ x.kw }}</td>
        <td>{{ x.xz }}</td>
      </tr>
    </table>

    <table class="bor-through fs14">
      <tr>
        <td align="right" width="8%">总金额：</td>
        <td>{{ totalPrice }} 元</td>
        <td align="right" width="8%">发料人：</td>
        <td>{{ data.flr }}</td>
        <td align="right" width="8%">库管员：</td>
        <td>{{ data.kgy }}</td>
        <td align="right" width="10%">领料人：</td>
        <td width="17%">{{ data.llr }}</td>
      </tr>
      <tr>
        <td align="right">备&nbsp;&nbsp;&nbsp;&nbsp;注：</td>
        <td colspan="5">{{ data.desc }}</td>
        <td align="right">打印时间：</td>
        <td>{{ nowTime }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-06-22 09:57:45
 **/
import moment from 'moment';

export default {
  props: ['data'],
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
  mounted() {
    this.$emit('onPrintTable', this.$refs.print.innerHTML);
  }
};
</script>
