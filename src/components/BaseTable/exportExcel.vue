<script>
/*
 * @Author: 焦质晔
 * @Date: 2020-02-02 15:58:17
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-06 20:11:10
 */
import { get, set } from 'lodash';
import Locale from '../_utils/mixins/locale';
import JsonToExcel from '../JsonToExcel';

export default {
  name: 'ExportExcel',
  mixins: [Locale],
  props: {
    columns: {
      type: Array,
      required: true,
      default: () => []
    },
    data: {
      type: Array,
      required: true,
      default: () => []
    },
    fileName: {
      type: String,
      default: '导出数据.xlsx'
    },
    fetch: {
      type: Object,
      default: () => ({})
    },
    onCalcExportData: {
      type: Function,
      default: () => {}
    }
  },
  computed: {
    filterColumns() {
      return this.columns.filter(x => x.dataIndex && x.dataIndex !== 'column-action').filter(x => !x.hidden);
    },
    fields() {
      const target = {};
      this.filterColumns.forEach(x => {
        target[x.title] = x.dataIndex;
      });
      return target;
    }
  },
  methods: {
    createDataList(list) {
      return list.map((x, i) => {
        let item = { ...x };
        this.filterColumns.forEach(x => {
          const { dataIndex, dictItems, editItems, editType } = x;
          const val = get(item, dataIndex);
          const dicts = dictItems || editItems || [];
          const target = dicts.find(x => x.value == val);
          let res = target ? target.text : val;
          // 数据是数组的情况
          if (Array.isArray(val)) {
            res = val
              .map(x => {
                let target = dicts.find(k => k.value == x);
                return target ? target.text : x;
              })
              .join(',');
          }
          set(item, dataIndex, res);
        });
        // 设置 index 序号
        set(item, 'index', i + 1);
        // 处理计算导出数据
        this.onCalcExportData(item);
        return item;
      });
    },
    createFetchParams(fetch) {
      if (!fetch.api) return null;
      const { api, datakey, total } = fetch;
      const params = { ...fetch.params };
      // 移除 xhrAbort 属性
      delete params.xhrAbort;
      return {
        fetch: {
          api,
          params: {
            ...params,
            currentPage: 1,
            pageSize: total, // 必须
            pageNum: 1,
            limit: total,
            current: 1, // 必须
            size: total
          },
          dataKey: fetch.datakey
        }
      };
    }
  },
  render() {
    const { data, fields, fileName, fetch } = this;
    const wrapProps = {
      props: {
        initialValue: data,
        fields,
        fileType: fileName.slice(fileName.lastIndexOf('.') + 1).toLowerCase(),
        fileName,
        ...this.createFetchParams(fetch),
        formatHandle: this.createDataList
      }
    };
    return (
      <div class="export-wrap">
        <JsonToExcel type="text" {...wrapProps}>
          {this.t('baseTable.export')}
        </JsonToExcel>
      </div>
    );
  }
};
</script>

<style lang="scss" scoped>
.export-wrap {
  display: inline-block;
  margin-right: $moduleMargin;
  /deep/ .el-button--text {
    font-size: $textSize;
  }
}
</style>
