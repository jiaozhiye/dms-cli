/*
 * @Author: 焦质晔
 * @Date: 2020-02-02 15:58:17
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-03 16:17:15
 */
import PropTypes from '@/components/_utils/vue-types';
import JsonToExcel from '@/components/JsonToExcel/JsonToExcel.vue';

import config from '../config';
import i18n from '../lang';
import { setCellValue, filterTableColumns } from '../utils';
import _ from 'lodash';

export default {
  name: 'Export',
  props: {
    flattenColumns: PropTypes.array,
    data: PropTypes.array.def([]),
    fileName: PropTypes.string.def(`${i18n.t('export.fileName')}.xlsx`),
    fetch: PropTypes.object
  },
  computed: {
    filterColumns() {
      return filterTableColumns(this.flattenColumns, ['__expandable__', '__selection__', config.operationColumn]);
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
      return list.map(x => {
        let item = { ...x };
        this.filterColumns.forEach((column, index) => {
          const { dataIndex, dictItems, render, extraRender } = column;
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
          // render 情况
          if (_.isFunction(render)) {
            res = render(val, item, column, item.index, index);
          }
          // extraRender 情况
          if (_.isFunction(extraRender)) {
            res = extraRender(val, item, column, item.index, index);
          }
          setCellValue(item, dataIndex, res);
        });
        return item;
      });
    },
    createFetchParams(fetch) {
      if (!fetch) {
        return null;
      }
      const { api, params, dataKey, total } = fetch;
      return {
        fetch: {
          api,
          params: {
            ...params,
            currentPage: 1,
            pageSize: total
          },
          dataKey
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
          {i18n.t('export.text')}
        </JsonToExcel>
      </div>
    );
  }
};
