/*
 * @Author: 焦质晔
 * @Date: 2020-02-02 15:58:17
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-27 15:44:32
 */
import PropTypes from '@/components/_utils/vue-types';
import JsonToExcel from '@/components/JsonToExcel/JsonToExcel.vue';

import config from '../config';
import { setCellValue, filterTableColumns } from '../utils';
import _ from 'lodash';

const noop = () => {};

export default {
  name: 'Export',
  props: {
    flattenColumns: PropTypes.array,
    data: PropTypes.array.def([]),
    fileName: PropTypes.string.def('导出数据.xlsx'),
    fetch: PropTypes.object.def({}),
    calcExportHandle: PropTypes.func.def(noop)
  },
  computed: {
    filterColumns() {
      return filterTableColumns(this.flattenColumns, ['__selection__', config.operationColumn]);
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
          const { dataIndex, dictItems } = x;
          const val = _.get(item, dataIndex);
          const dicts = dictItems || [];
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
          setCellValue(item, dataIndex, res);
        });
        // 设置 index 序号
        setCellValue(item, 'index', i + 1);
        // 处理计算导出数据
        this.calcExportHandle(item);
        return item;
      });
    },
    createFetchParams(fetch) {
      if (!fetch.api) return null;
      const { api, dataKey, total } = fetch;
      const params = { ...fetch.params };
      // 移除 xhrAbort 属性
      delete params.xhrAbort;
      return {
        fetch: {
          api,
          params: {
            ...params,
            currentPage: 1,
            pageSize: total
          },
          datakey: dataKey
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
      <div class="v-export--wrapper">
        <JsonToExcel size="small" type="text" {...wrapProps}>
          导出
        </JsonToExcel>
      </div>
    );
  }
};
