/*
 * @Author: 焦质晔
 * @Date: 2020-03-26 11:44:24
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-29 01:49:34
 */
import { convertToRows, deepFindColumn, filterTableColumns, getCellValue } from '../utils';
import config from '../config';
import _ from 'lodash';

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
    headColumns() {
      return filterTableColumns(this.tableColumns, ['__selection__', config.operationColumn]);
    },
    flatColumns() {
      return filterTableColumns(this.flattenColumns, ['__selection__', config.operationColumn]);
    }
  },
  methods: {
    createChunkColumnRows(chunkColumns, tableColumns) {
      let res = [];
      chunkColumns.forEach(columns => {
        let tmp = [];
        columns.forEach(column => {
          if (column.level === 1) {
            tmp.push(column);
          } else {
            tmp.push(this.createDeepColumn(column, tableColumns));
          }
        });
        this.mergeColumns(tmp);
        res.push(convertToRows(tmp));
      });
      return res;
    },
    createDeepColumn(item, columns) {
      const parent = Object.assign({}, deepFindColumn(columns, item.parentDataIndex));
      parent.children = [item];
      if (parent.level > 1) {
        return this.createDeepColumn(parent, columns);
      }
      return parent;
    },
    mergeColumns(columns) {
      const keys = [...new Set(columns.map(x => x.dataIndex))];
      return keys.map(x => {
        const res = columns.filter(k => k.dataIndex === x);
        if (res.length <= 1) {
          return res[0];
        } else {
          return this.doMerge(res);
        }
      });
    },
    doMerge(columns) {
      // ...
    },
    createChunkColumns(columns) {
      let res = [];
      let tmp = [];
      let sum = 0;
      let i = 0;
      for (; i < columns.length; ) {
        const column = columns[i];
        const w = column.width || column.renderWidth || config.defaultColumnWidth;
        sum += w;
        if (sum <= config.printWidth) {
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
      const chunkFlatColumns = this.createChunkColumns([...this.flatColumns]);
      const chunkColumnRows = this.createChunkColumnRows(chunkFlatColumns, this.headColumns);
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
      for (let i = 0; i < chunkFlatColumns.length; i++) {
        html += this._toTable(chunkColumnRows[i], chunkFlatColumns[i]);
        html += `<div class="v-page-break"></div>`;
      }
      html += this._toJs();
      return html + `</body></html>`;
    },
    _toTable(columnRows, flatColumns) {
      const { tableFullData, $$tableFooter } = this.$$table;
      const summationRows = this.showFooter ? $$tableFooter.summationRows : [];
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
    _toJs() {
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
      return this.$$table.$$tableBody.renderText(text, column);
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
