/*
 * @Author: 焦质晔
 * @Date: 2020-05-12 13:07:13
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-02 15:29:28
 */
import addEventListener from 'add-dom-event-listener';
import Spin from '../Spin';
import TopFilter from '../TopFilter';
import VirtualTable from '../VirtualTable';

import { merge, isFunction } from 'lodash';
import { debounce, sleep } from '../_utils/tool';
import PropTypes from '../_utils/vue-types';

import Locale from '../_utils/mixins/locale';

const noop = () => {};

export default {
  name: 'SearchHelper',
  mixins: [Locale],
  props: {
    name: PropTypes.string, // tds
    filters: PropTypes.arrayOf(PropTypes.shape({ fieldName: PropTypes.string }).loose).def([]),
    initialValue: PropTypes.object.def({}),
    table: PropTypes.shape({
      columns: PropTypes.array.def([]),
      rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).def('uid'),
      fetch: PropTypes.object.isRequired
    }),
    fieldAliasMap: PropTypes.func.def(noop),
    beforeFetch: PropTypes.func,
    dataIndex: PropTypes.string,
    callback: PropTypes.func,
    fieldsDefine: PropTypes.object.def({}), // tds
    getServerConfig: PropTypes.func // tds
  },
  data() {
    const { fetch } = this.table;
    // tds
    this.DEFINE = ['valueName', 'displayName', 'descriptionName'];
    return {
      result: null,
      topFilters: this.createTopFilters(),
      height: 300,
      columns: this.createTableColumns(),
      fetch: {
        api: fetch.api,
        params: fetch.params || {},
        dataKey: fetch.dataKey
      },
      loading: false,
      alias: this.fieldAliasMap() || {}
    };
  },
  computed: {
    $topFilter() {
      return this.$refs.topFilter;
    },
    $vTable() {
      return this.$refs.vTable;
    },
    disabled() {
      return !this.result;
    }
  },
  created() {
    this.getHelperConfig();
  },
  mounted() {
    this.resizeEvent = addEventListener(window, 'resize', this.resizeEventHandle);
    this.calcTableHeight();
  },
  destroyed() {
    this.resizeEvent && this.resizeEvent.remove();
  },
  methods: {
    async getHelperConfig() {
      if (!this.getServerConfig) return;
      if (!this.name) {
        return console.error(`[SearchHelper]: 从服务端获取配置信息的时候，name 为必选参数.`);
      }
      this.loading = true;
      if (process.env.MOCK_DATA === 'true') {
        const mockFilters = [
          {
            type: 'INPUT',
            label: '条件1',
            fieldName: 'x1'
          },
          {
            type: 'SELECT',
            label: '条件2',
            fieldName: 'x2',
            refListName: 'sex'
          }
        ];
        const mockColumns = [
          {
            title: '姓名',
            dataIndex: 'person.name'
          },
          {
            title: '性别',
            dataIndex: 'person.sex',
            refListName: 'sex'
          }
        ];
        await sleep(500);
        // 设置 topFilters、columns
        this.topFilters = this.createTopFilters(mockFilters);
        this.columns = this.createTableColumns(mockColumns);
        // 设置 alias
        let target = {};
        for (let key in this.fieldsDefine) {
          if (!this.DEFINE.includes(key)) continue;
          target[this.fieldsDefine[key]] = 'address';
        }
        this.alias = Object.assign({}, target);
      } else {
        try {
          const res = await this.getServerConfig({ name: this.name });
          if (res.code === 200) {
            const { data } = res;
            // 设置 topFilters、columns
            this.topFilters = this.createTopFilters(data.filters);
            this.columns = this.createTableColumns(data.columns);
            // 设置 alias
            let target = {};
            for (let key in this.fieldsDefine) {
              if (!this.DEFINE.includes(key)) continue;
              target[this.fieldsDefine[key]] = data[key];
            }
            this.alias = Object.assign({}, target);
          }
        } catch (e) {}
      }
      this.loading = false;
    },
    createTableColumns(vals = []) {
      return [
        {
          title: '序号',
          dataIndex: 'index',
          width: 80,
          render: text => {
            return text + 1;
          }
        },
        ...(this.table.columns || []),
        ...vals.map(x => {
          let dict = x.refListName ? { dictItems: this.createDictList(x.refListName) } : null;
          return {
            ...x,
            ...dict
          };
        })
      ];
    },
    createTopFilters(vals = []) {
      return [
        ...(this.filters || []),
        ...vals.map(x => {
          let option = x.refListName ? { options: { itemList: this.createDictList(x.refListName) } } : null;
          return {
            ...x,
            ...option
          };
        })
      ];
    },
    filterChangeHandle(val) {
      let { params } = this.fetch;
      if (isFunction(this.beforeFetch)) {
        val = this.beforeFetch(val);
      }
      // tds 搜索条件的参数规范
      if (isFunction(this.getServerConfig)) {
        val = { name: this.name, condition: val };
      }
      this.fetch.params = merge({}, params, val);
    },
    collapseHandle() {
      this.$nextTick(() => this.calcTableHeight());
    },
    selectedRowChange(keys, rows) {
      this.result = rows.length ? rows[0] : null;
    },
    dbClickHandle(row) {
      this.result = row;
      this.confirmHandle();
    },
    confirmHandle() {
      const tableData = this.createTableData();
      if (this.callback) {
        Array.isArray(tableData) && this.callback(...tableData);
      }
      this.cancelHandle(this.result);
    },
    cancelHandle(data) {
      this.$emit('close', false, data, this.alias);
    },
    createDictList(code) {
      let $dict = JSON.parse(localStorage.getItem('dict')) || {};
      let res = [];
      if ($dict && Array.isArray($dict[code])) {
        res = $dict[code].map(x => ({ text: x.cnText, value: x.value }));
      }
      return res;
    },
    createTableData() {
      if (!Object.keys(this.alias).length) return;
      let others = {};
      let current;
      for (let dataIndex in this.alias) {
        let dataKey = this.alias[dataIndex];
        if (dataIndex !== this.dataIndex) {
          others[dataIndex] = this.result[dataKey];
        } else {
          current = this.result[dataKey];
        }
      }
      return [current, others];
    },
    calcTableHeight() {
      // 窗口高度 - 上下外边距 - header - footer
      const containerHeight = window.innerHeight - window.innerHeight * 0.1 * 2 - 50 * 2;
      this.height = containerHeight - this.$topFilter.$el.offsetHeight - 100;
    },
    resizeEventHandle() {
      debounce(this.calcTableHeight, 20)();
    }
  },
  render() {
    const { loading, initialValue, topFilters, height, columns, fetch, disabled } = this;
    return (
      <div>
        <Spin spinning={loading} tip="Loading...">
          <TopFilter ref="topFilter" initialValue={initialValue} list={topFilters} onChange={this.filterChangeHandle} onCollapseChange={this.collapseHandle} />
          <VirtualTable
            ref="vTable"
            height={height}
            columns={columns}
            rowKey={this.table.rowKey}
            fetch={fetch}
            rowSelection={{
              type: 'radio',
              onChange: this.selectedRowChange
            }}
            columnsChange={columns => (this.columns = columns)}
            onRowDblclick={this.dbClickHandle}
          />
        </Spin>
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: 9,
            borderTop: '1px solid #d9d9d9',
            padding: '10px 15px',
            background: '#fff',
            textAlign: 'right'
          }}
        >
          <el-button onClick={() => this.cancelHandle()}>{this.t('searchHelper.close')}</el-button>
          <el-button type="primary" onClick={() => this.confirmHandle()} disabled={disabled}>
            {this.t('searchHelper.confirm')}
          </el-button>
        </div>
      </div>
    );
  }
};
