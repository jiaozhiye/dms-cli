/*
 * @Author: 焦质晔
 * @Date: 2020-03-26 11:44:24
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-27 16:48:41
 */
import { convertToRows, filterTableColumns, getCellValue } from '../utils';
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
      .v-page-break {
        page-break-after: always;
      }
    `;
    return {};
  },
  computed: {
    $$tableBody() {
      return this.$$table.$refs[`tableBody`];
    },
    columnRows() {
      return convertToRows(filterTableColumns(this.tableColumns, ['__selection__', config.operationColumn]));
    },
    flatColumns() {
      return filterTableColumns(this.flattenColumns, ['__selection__', config.operationColumn]);
    }
  },
  methods: {
    createChunckColumns(columns) {
      columns = [...columns];
      let res = [];
      let tmp = [];
      let sum = 0;
      let i = 0;
      for (; i < columns.length; ) {
        const column = columns[i];
        const w = column.width || column.renderWidth || config.defaultColumnWidth;
        sum += w;
        if (sum <= 750) {
          tmp.push(column);
          if (i === columns.length - 1) {
            res.push(tmp);
          }
          i++;
        } else {
          columns.splice(0, i);
          res.push(tmp);
          tmp = [];
          sum = 0;
          i = 0;
        }
      }
      return res;
    },
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
      let html = [
        `<!DOCTYPE html>`,
        `<html>`,
        `<head>`,
        `<meta charset="utf-8">`,
        `<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,minimal-ui">`,
        `<title>打印表格</title>`,
        `<style>${this.defaultHtmlStyle}</style>`,
        `</head>`,
        `<body>`
      ].join('');
      html += this.toTable(this.columnRows, this.flatColumns);
      html += `<div class="v-page-break"></div>`;
      html += this.toJs();
      return html + `</body></html>`;
    },
    toTable(columnRows, flatColumns) {
      const { tableFullData } = this.$$table;
      const summationRows = this.showFooter ? this.$$table.$refs[`tableFooter`].summationRows : [];
      let html = `<table class="v-table--print" width="100%" border="0" cellspacing="0" cellpadding="0">`;
      html += `<colgroup>${flatColumns.map(({ width, renderWidth }) => `<col style="width:${width || renderWidth || config.defaultColumnWidth}px"}>`).join('')}</colgroup>`;
      if (this.showHeader) {
        html += `<thead>${columnRows
          .map(columns => `<tr>${columns.map(column => `<th colspan="${column.colSpan}" rowspan="${column.rowSpan}">${column.title}</th>`).join('')}</tr>`)
          .join('')}</thead>`;
      }
      if (tableFullData.length) {
        html += `<tbody>${tableFullData.map(row => `<tr>${flatColumns.map((column, index) => `<td>${this.renderCell(row, row.index, column, index)}</td>`).join('')}</tr>`).join('')}</tbody>`;
      }
      if (this.showFooter && flatColumns.some(x => !!x.summation)) {
        html += `<tfoot>${summationRows
          .map(row => `<tr>${flatColumns.map((column, index) => `<td>${index > 0 ? getCellValue(row, column.dataIndex) : config.summaryText}</td>`).join('')}</tr>`)
          .join('')}</tfoot>`;
      }
      html += '</table>';
      return html;
    },
    toJs() {
      return `
        <script>
          setTimeout(() => window.print());
        </script>
      `;
    },
    renderCell(row, rowIndex, column, columnIndex) {
      const { dataIndex, render } = column;
      const text = getCellValue(row, dataIndex);
      if (_.isFunction(render)) {
        return render(text, row, column, rowIndex, columnIndex);
      }
      return this.$$tableBody.renderText(text, column);
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
