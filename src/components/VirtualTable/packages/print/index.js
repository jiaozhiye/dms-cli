/*
 * @Author: 焦质晔
 * @Date: 2020-03-26 11:44:24
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-13 13:36:43
 */
import { convertToRows, deepFindColumn, filterTableColumns, downloadFile, getCellValue } from '../utils';
import config from '../config';
import Locale from '../locale/mixin';
import _ from 'lodash';

export default {
  name: 'PrintTable',
  mixins: [Locale],
  props: ['tableColumns', 'flattenColumns', 'showHeader', 'showFooter', 'showLogo'],
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
        table-layout: fixed;
        border-spacing: 0;
        border-collapse: collapse;
      }
      .v-table--print {
        font-size: 14px;
        text-align: left;
      }
      .v-table--print th,
      .v-table--print td {
        padding: 5px;
        border: 1px solid #000;
      }
      .no-border th,
      .no-border td {
        border: 0!important;
      }
      .v-table--print th[colspan]:not([colspan='1']) {
        text-align: center;
      }
      .v-page-break {
        page-break-after: always;
      }
    `;
    return {};
  },
  computed: {
    headColumns() {
      return filterTableColumns(this.tableColumns, ['__expandable__', '__selection__', config.operationColumn]);
    },
    flatColumns() {
      return filterTableColumns(this.flattenColumns, ['__expandable__', '__selection__', config.operationColumn]);
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
            // 深度拆分列
            tmp.push(this.deepCreateColumn(column, tableColumns));
          }
        });
        // 合并列
        tmp = this.mergeColumns(tmp);
        res.push(convertToRows(tmp));
      });
      return res;
    },
    deepCreateColumn(item, columns) {
      const parent = Object.assign({}, deepFindColumn(columns, item.parentDataIndex));
      parent.children = [item];
      if (parent.level > 1) {
        return this.deepCreateColumn(parent, columns);
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
          return this.doMerge(res, 'dataIndex')[0];
        }
      });
    },
    doMerge(columns, mark) {
      return _(_.flatten(columns))
        .groupBy(mark)
        .map(
          _.spread((...values) => {
            return _.mergeWith(...values, (objValue, srcValue) => {
              if (Array.isArray(objValue)) {
                return this.doMerge(objValue.concat(srcValue), mark);
              }
            });
          })
        )
        .value();
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
      const opts = { filename: 'print', type: 'html', download: false };
      downloadFile(opts, this.toHtml()).then(({ content, blob }) => {
        let printFrame = document.createElement('iframe');
        printFrame.setAttribute('frameborder', '0');
        printFrame.setAttribute('width', '100%');
        printFrame.setAttribute('height', '0');
        printFrame.style.display = 'none';
        document.body.appendChild(printFrame);
        if (this.$$table.isIE) {
          printFrame.contentDocument.write(content);
          printFrame.contentDocument.execCommand('print');
          printFrame.parentNode.removeChild(printFrame);
          printFrame = null;
        } else {
          printFrame.onload = ev => {
            if (ev.target.src) {
              ev.target.contentWindow.print();
            }
            setTimeout(() => {
              printFrame.parentNode.removeChild(printFrame);
              printFrame = null;
            });
          };
          printFrame.src = URL.createObjectURL(blob);
        }
      });
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
        `<style>${this.defaultHtmlStyle}</style>`,
        `</head>`,
        `<body>`
      ].join('');
      for (let i = 0; i < chunkFlatColumns.length; i++) {
        html += this._toTable(chunkColumnRows[i], chunkFlatColumns[i]);
        html += `<div class="v-page-break"></div>`;
      }
      return html + `</body></html>`;
    },
    _toTable(columnRows, flatColumns) {
      const { tableFullData, $refs } = this.$$table;
      const summationRows = this.showFooter ? $refs[`tableFooter`].summationRows : [];
      let html = `<table class="v-table--print" width="100%" border="0" cellspacing="0" cellpadding="0">`;
      html += `<colgroup>${flatColumns.map(({ width, renderWidth }) => `<col style="width:${width || renderWidth || config.defaultColumnWidth}px"}>`).join('')}</colgroup>`;
      if (this.showHeader) {
        html += [
          `<thead>`,
          this.showLogo ? `<tr><th colspan="${flatColumns.length}" style="border: 0">${this._toLogo()}</th></tr>` : '',
          columnRows.map(columns => `<tr>${columns.map(column => `<th colspan="${column.colSpan}" rowspan="${column.rowSpan}">${column.title}</th>`).join('')}</tr>`).join(''),
          `</thead>`
        ].join('');
      }
      if (tableFullData.length) {
        html += `<tbody>${tableFullData.map(row => `<tr>${flatColumns.map((column, index) => `<td>${this.renderCell(row, row.index, column, index)}</td>`).join('')}</tr>`).join('')}</tbody>`;
      }
      if (this.showFooter && flatColumns.some(x => !!x.summation)) {
        html += `<tfoot>${summationRows
          .map(
            row =>
              `<tr>${flatColumns
                .map((column, index) => {
                  let text = getCellValue(row, column.dataIndex);
                  return `<td>${index === 0 && text === '' ? config.summaryText() : text}</td>`;
                })
                .join('')}</tr>`
          )
          .join('')}</tfoot>`;
      }
      html += '</table>';
      return html;
    },
    _toLogo() {
      const baseUrl = window.location.origin;
      return `
        <table class="no-border" width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td width="50%" align="left">
              <img src="${baseUrl}/static/img/logo_l.png" border="0" height="26" />
            </td>
            <td width="50%" align="right">
              <img src="${baseUrl}/static/img/logo_r.png" border="0" height="36" />
            </td>
          </tr>
        </table>
      `;
    },
    renderCell(row, rowIndex, column, columnIndex) {
      const { dataIndex, render, extraRender } = column;
      const text = getCellValue(row, dataIndex);
      if (_.isFunction(extraRender)) {
        return extraRender(text, row, column, rowIndex, columnIndex);
      }
      if (_.isFunction(render)) {
        return render(text, row, column, rowIndex, columnIndex);
      }
      return this.$$table.$$tableBody.renderText(text, column, row);
    }
  },
  render() {
    const cls = [`v-print--wrapper`, `size--${this.$$table.tableSize}`];
    return (
      <span class={cls} title={this.t('table.print.text')} onClick={this.printHandle}>
        <i class="iconfont icon-printer" />
      </span>
    );
  }
};
