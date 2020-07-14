/*
 * @Author: 焦质晔
 * @Date: 2020-05-20 09:36:38
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-14 14:43:01
 */
import { maxBy, minBy, sumBy } from 'lodash';
import { sleep, groupBy, getCellValue, setCellValue } from '../utils';
import config from '../config';

import VTable from '../table';

export default {
  name: 'GroupSummaryResult',
  props: ['columns', 'group', 'summary'],
  inject: ['$$table'],
  data() {
    const groupColumns = this.group.map(x => ({
      dataIndex: x.group,
      ...this.formatColumn(x.group)
    }));
    const summaryColumns = this.summary.map(x => {
      if (x.summary === config.groupSummary.total.value) {
        return { dataIndex: x.summary, title: config.groupSummary.total.text };
      }
      return { dataIndex: x.summary, ...this.formatColumn(x.summary) };
    });
    return {
      loading: !1,
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
  computed: {
    fetchParams() {
      const { fetchParams, pagination } = this.$$table;
      const result = {};
      const pageKeys = Object.keys(pagination);
      for (let key in fetchParams) {
        if (pageKeys.includes(key)) continue;
        result[key] = fetchParams[key];
      }
      return result;
    },
    params() {
      const selectSQL = this.summary.map(x => `${x.formula}(${x.summary})`).join(',');
      const groupBySQL = this.group.map(x => `${x.group}`).join(',');
      return {
        ...this.fetchParams,
        summary: `${selectSQL}|${groupBySQL}`
      };
    }
  },
  mounted() {
    if (this.$$table.isFetch) {
      this.getvTableData();
    } else {
      this.list = this.createvTableData(this.$$table.tableFullData);
    }
  },
  methods: {
    formatColumn(dataIndex) {
      const column = this.columns.find(x => x.dataIndex === dataIndex);
      return {
        title: column.title,
        dictItems: column.dictItems ?? []
      };
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
          dataIndex: x.dataIndex,
          dictItems: x.dictItems
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
          if (fn === 'count') {
            setCellValue(record, key, arr.length);
          }
          if (fn === 'sum') {
            setCellValue(record, key, sumBy(arr, key));
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
    },
    async getvTableData() {
      this.loading = !0;
      if (process.env.MOCK_DATA === 'true') {
        await sleep(500);
        this.list = this.createvTableData(this.$$table.tableFullData);
      } else {
        // console.log(`ajax 请求参数：`, this.params);
        try {
          const res = await this.$$table.fetch.api(this.params);
          if (res.code === 200) {
            this.list = res.data ?? [];
          } else {
            this.list = [];
          }
        } catch (e) {}
      }
      this.loading = !1;
    }
  },
  render() {
    const { vColumns, list, loading, exportExcel, tablePrint } = this;
    return (
      <div>
        <VTable
          height={400}
          loading={loading}
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
