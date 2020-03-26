/*
 * @Author: 焦质晔
 * @Date: 2020-03-26 11:44:24
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-26 20:53:42
 */
import { convertToRows, getCellValue } from '../utils';
import config from '../config';

export default {
  name: 'PrintTable',
  props: ['tableColumns', 'flattenColumns', 'showHeader', 'showFooter'],
  inject: ['$$table'],
  data() {
    this.defaultHtmlStyle = `
      * {
        margin: 0;
        padding: 0;
      }
      body * {
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
      }
      table {
        border-spacing: 0;
        border-collapse: collapse;
        table-layout: fixed;
      }
      .v-table--print {
        width: 100%;
        font-size: 14px;
        text-align: left;
        border: 1px solid #000;
      }
      .v-table--print th,
      .v-table--print td {
        padding: 5px;
        border: 1px solid #000;
      }
    `;
    return {};
  },
  computed: {
    columnRows() {
      return convertToRows(this.tableColumns.filter(x => x.dataIndex !== '__selection__'));
    },
    flatColumns() {
      return this.flattenColumns.filter(x => x.dataIndex !== '__selection__');
    }
  },
  methods: {
    printHandle() {
      const elIframe = document.createElement('iframe');
      elIframe.setAttribute('frameborder', '0');
      elIframe.style.display = 'none';
      document.body.appendChild(elIframe);
      elIframe.onload = function() {
        // console.log(this.contentWindow);
        // this.focus();
        // this.contentWindow.print();
        setTimeout(() => {
          this.parentNode.removeChild(this);
        }, 100);
      };
      elIframe.src = `data:text/html;charset=utf-8,${encodeURIComponent(this.toHtml())}`;
    },
    toHtml() {
      const { tableFullData } = this.$$table;
      const summationRows = this.showFooter ? this.$$table.$refs[`tableFooter`].summationRows : [];
      let html = [
        `<!DOCTYPE html>`,
        `<html>`,
        `<head>`,
        `<meta charset="utf-8">`,
        `<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,minimal-ui">`,
        `<title>打印表格</title>`,
        `<style>${this.defaultHtmlStyle}</style>`,
        `</head>`,
        `<body>`,
        `<table class="v-table--print" width="100%" border="0" cellspacing="0" cellpadding="0">`,
        `<colgroup>${this.flatColumns.map(({ width, renderWidth }) => `<col ${(width || renderWidth) > 0 ? `style="width:${width || renderWidth}px"` : ''}>`).join('')}</colgroup>`
      ].join('');
      if (this.showHeader) {
        html += `<thead>${this.columnRows
          .map(columns => `<tr>${columns.map(column => `<th colspan="${column.colSpan}" rowspan="${column.rowSpan}">${column.title}</th>`).join('')}</tr>`)
          .join('')}</thead>`;
      }
      if (tableFullData.length) {
        html += `<tbody>${tableFullData.map(row => `<tr>${this.flatColumns.map(column => `<td>${getCellValue(row, column.dataIndex)}</td>`).join('')}</tr>`).join('')}</tbody>`;
      }
      if (this.showFooter) {
        html += `<tfoot>${summationRows
          .map(row => `<tr>${this.flatColumns.map((column, index) => `<td>${index > 0 ? getCellValue(row, column.dataIndex) : config.summaryText}</td>`).join('')}</tr>`)
          .join('')}</tfoot>`;
      }
      html += '</table>';
      html += `
        <script>
          setTimeout(() => window.print());
        </script>
      `;
      return html + `</body></html>`;
    }
  },
  render() {
    return (
      <span class="v-print--wrapper" onClick={this.printHandle}>
        <i class="iconfont icon-printer" /> 打印
      </span>
    );
  }
};
