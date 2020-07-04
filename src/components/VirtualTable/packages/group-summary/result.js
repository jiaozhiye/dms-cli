/*
 * @Author: 焦质晔
 * @Date: 2020-05-20 09:36:38
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-06-20 10:39:12
 */
import { maxBy, minBy, sumBy } from 'lodash';
import config from '../config';
import { groupBy, getCellValue, setCellValue } from '../utils';

import VTable from '../table';

export default {
  name: 'GroupSummaryResult',
  props: ['columns', 'group', 'summary'],
  inject: ['$$table'],
  data() {
    const groupColumns = this.group.map(x => ({ dataIndex: x.group, title: this.findColumnTitle(x.group) }));
    const summaryColumns = this.summary.map(x => {
      if (x.summary === config.groupSummary.total.value) {
        return { dataIndex: x.summary, title: config.groupSummary.total.text };
      }
      return { dataIndex: x.summary, title: this.findColumnTitle(x.summary) };
    });
    return {
      list: [], // 汇总表格数据
      vColumns: this.createvTableColumns(groupColumns, summaryColumns),
      exportExcel: {
        fileName: '汇总结果.xlsx'
      },
      tablePrint: {
        showLogo: true
      }
    };
  },
  mounted() {
    this.list = this.createvTableData(this.$$table.tableFullData);
  },
  methods: {
    findColumnTitle(dataIndex) {
      return this.columns.find(x => x.dataIndex === dataIndex).title;
    },
    createvTableColumns(groupColumns, summaryColumns) {
      return [
        {
          title: '序号',
          dataIndex: 'index',
          width: 80,
          render: text => {
            return text + 1;
          }
        },
        ...groupColumns.map(x => ({
          title: x.title,
          dataIndex: x.dataIndex
        })),
        ...summaryColumns.map(x => ({
          title: x.title,
          dataIndex: x.dataIndex,
          summation: {}
        }))
      ];
    },
    createvTableData(list) {
      const result = groupBy(
        list,
        this.group.map(x => x.group)
      );
      // =================
      let res = [];
      result.forEach(arr => {
        let record = {};
        this.vColumns.forEach(x => {
          const { dataIndex } = x;
          if (dataIndex === 'index') return;
          setCellValue(record, dataIndex, getCellValue(arr[0], dataIndex));
        });
        this.summary.forEach(x => {
          let key = x.summary;
          let fn = x.formula;
          if (fn === 'sum') {
            setCellValue(record, key, key !== '__total__' ? sumBy(arr, key) : arr.length);
          }
          if (fn === 'max') {
            setCellValue(record, key, maxBy(arr, key)[key]);
          }
          if (fn === 'min') {
            setCellValue(record, key, minBy(arr, key)[key]);
          }
          if (fn === 'avg') {
            setCellValue(record, key, (sumBy(arr, key) / arr.length).toFixed(2));
          }
        });
        res.push(record);
      });
      // =================
      return res;
    }
  },
  render() {
    const { vColumns, list, exportExcel, tablePrint } = this;
    return (
      <div>
        <VTable
          height={400}
          dataSource={list}
          columns={vColumns}
          showFullScreen={false}
          rowKey={record => record.index}
          exportExcel={exportExcel}
          tablePrint={tablePrint}
          columnsChange={columns => (this.vColumns = columns)}
        />
      </div>
    );
  }
};
