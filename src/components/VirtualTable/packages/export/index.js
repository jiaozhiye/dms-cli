/*
 * @Author: 焦质晔
 * @Date: 2020-02-02 15:58:17
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-07 17:54:50
 */
import PropTypes from '../../../_utils/vue-types';
import JsonToExcel from '../../../JsonToExcel';

import config from '../config';
import i18n from '../locale';
import Locale from '../locale/mixin';
import { setCellValue, filterTableColumns } from '../utils';
import { get, isFunction } from 'lodash';

export default {
  name: 'Export',
  mixins: [Locale],
  props: {
    flattenColumns: PropTypes.array,
    data: PropTypes.array.def([]),
    fileName: PropTypes.string.def(`${i18n.t('table.export.fileName')}.xlsx`),
    fetch: PropTypes.object
  },
  inject: ['$$table'],
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
          const val = get(item, dataIndex);
          const dicts = dictItems || [];
          const target = dicts.find(x => x.value == val);
          let res = target?.text ?? val;
          // 数据是数组的情况
          if (Array.isArray(val)) {
            res = val
              .map(x => {
                let target = dicts.find(k => k.value == x);
                return target?.text ?? x;
              })
              .join(',');
          }
          // render 情况
          if (isFunction(render)) {
            res = render(val, item, column, item.index, index);
          }
          // extraRender 情况
          if (isFunction(extraRender)) {
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
    const cls = [`v-export--wrapper`, `size--${this.$$table.tableSize}`];
    return (
      <div class={cls} title={this.t('table.export.text')}>
        <JsonToExcel type="text" {...wrapProps} />
      </div>
    );
  }
};
