/*
 * @Author: 焦质晔
 * @Date: 2020-02-02 10:26:05
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-11 09:24:08
 */
import { get, isFunction, isObject, isBoolean } from 'lodash';
import XLSX from 'xlsx';
import { Message } from 'element-ui';
import PropTypes from '../_utils/vue-types';
import Locale from '../_utils/mixins/locale';
import { download } from './download.js';

export default {
  name: 'JsonToExcel',
  mixins: [Locale],
  props: {
    // Json to download
    initialValue: PropTypes.array.def([]).isRequired,
    // fields inside the Json Object that you want to export
    fields: PropTypes.object.def({}).isRequired,
    // Use as fallback when the row has no field values
    defaultValue: PropTypes.string.def(''),
    // mime type [xlsx, csv]
    fileType: PropTypes.string.def('xlsx'),
    // filename to export
    fileName: PropTypes.string,
    // ajax function
    fetch: PropTypes.object.def({}),
    // sheet prefix
    workSheet: PropTypes.string.def('sheet'),
    // format data handle
    formatHandle: PropTypes.func,
    // event before generate was called
    beforeGenerate: PropTypes.func,
    // event before download pops up
    beforeFinish: PropTypes.func
  },
  data() {
    this.workbook = {
      SheetNames: [],
      Sheets: {}
    };
    return {
      loading: false
    };
  },
  computed: {
    // unique identifier
    idName() {
      var now = new Date().getTime();
      return 'export_' + now;
    },
    wbopts() {
      return {
        bookType: this.fileType,
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: 'binary'
      };
    }
  },
  methods: {
    async generate() {
      if (isFunction(this.beforeGenerate)) {
        await this.beforeGenerate();
      }
      let { api, params, dataKey } = this.fetch;
      let data = this.initialValue;
      if (api) {
        try {
          this.loading = !0;
          const res = await api(params);
          if (res.code === 200) {
            data = (!dataKey ? res.data : get(res.data, dataKey)) || [];
          }
        } catch (err) {}
        this.loading = !1;
      }
      if (!data.length) {
        return Message.warning(this.t('jsonToExcel.noData'));
      }
      if (this.formatHandle) {
        data = this.formatHandle(data);
      }
      let json = this.getProcessedJson(data, this.fields);
      // 执行导出
      this.export(this.getSheetData([json]), this.fileName);
    },
    getSheetData(data) {
      this.clearWorkbook();
      data.forEach((el, index) => {
        const sheetName = `${this.workSheet}${index + 1}`;
        this.workbook.SheetNames.push(sheetName);
        this.workbook.Sheets[sheetName] = XLSX.utils.json_to_sheet(el);
      });
      return XLSX.write(this.workbook, this.wbopts);
    },
    async export(data, filename) {
      let blob = this.sheetToBlob(data);
      if (isFunction(this.beforeFinish)) {
        await this.beforeFinish();
      }
      const res = download(blob, filename);
      res ? this.$emit('success') : this.$emit('error');
    },
    getProcessedJson(data, header) {
      let keys = this.getKeys(data, header);
      let newData = [];
      data.forEach((item, index) => {
        let newItem = {};
        for (let label in keys) {
          let property = keys[label];
          newItem[label] = this.getValue(property, item);
        }
        newData.push(newItem);
      });
      return newData;
    },
    getKeys(data, header) {
      if (header) {
        return header;
      }
      let keys = {};
      for (let key in data[0]) {
        keys[key] = key;
      }
      return keys;
    },
    getValue(key, item) {
      const field = isObject(key) ? key.field : key;
      let indexes = Array.isArray(field) ? field : field.split('.');
      let value = this.defaultValue;
      if (!field) value = item;
      else if (indexes.length > 1) value = this.getValueFromNestedItem(item, indexes);
      else value = this.parseValue(item[field]);
      if (key.hasOwnProperty('callback')) value = this.getValueFromCallback(value, key.callback);
      return value;
    },
    getValueFromNestedItem(item, indexes) {
      let nestedItem = item;
      for (let index of indexes) {
        if (nestedItem) nestedItem = nestedItem[index];
      }
      return this.parseValue(nestedItem);
    },
    getValueFromCallback(item, callback) {
      if (!isFunction(callback)) return this.defaultValue;
      const value = callback(item);
      return this.parseValue(value);
    },
    parseValue(value) {
      return value || value === 0 || isBoolean(value) ? value : this.defaultValue;
    },
    clearWorkbook() {
      this.workbook.SheetNames = [];
      this.workbook.Sheets = {};
    },
    sheetToBlob(data) {
      function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
      }
      return new Blob([s2ab(data)], { type: 'application/octet-stream' }); // 字符串转 ArrayBuffer
    }
  },
  render() {
    const { $props, $attrs, $slots, loading } = this;
    const wrapProps = {
      key: this.idName,
      props: {
        ...$props,
        loading
      },
      attrs: {
        id: this.idName,
        ...$attrs,
        icon: 'iconfont icon-export'
      },
      on: {
        click: this.generate
      }
    };
    return <el-button {...wrapProps}>{$slots['default']}</el-button>;
  }
};
