<script>
/*
 * @Author: 焦质晔
 * @Date: 2020-02-02 10:26:05
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-02-26 18:32:35
 */
import _ from 'lodash';
import XLSX from 'xlsx';
import { download } from './download.js';

export default {
  name: 'JsonToExcel',
  props: {
    // Json to download
    initialValue: {
      type: Array,
      required: true,
      default: () => []
    },
    // fields inside the Json Object that you want to export
    fields: {
      type: Object,
      required: true,
      default: () => ({})
    },
    // Use as fallback when the row has no field values
    defaultValue: {
      type: String,
      default: ''
    },
    // mime type [xlsx, csv]
    fileType: {
      type: String,
      default: 'xlsx'
    },
    // filename to export
    fileName: {
      type: String
    },
    // ajax function
    fetch: {
      type: Object,
      default: () => ({})
    },
    // sheet prefix
    workSheet: {
      type: String,
      default: 'sheet'
    },
    // format data handle
    formatHandle: {
      type: Function
    },
    // event before generate was called
    beforeGenerate: {
      type: Function
    },
    // event before download pops up
    beforeFinish: {
      type: Function
    }
  },
  data() {
    this.workbook = {
      SheetNames: [],
      Sheets: {}
    };
    return {};
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
      if (_.isFunction(this.beforeGenerate)) {
        await this.beforeGenerate();
      }
      let { api, params, datakey } = this.fetch;
      let data = this.initialValue;
      if (api) {
        try {
          const res = await api(params);
          if (res.resultCode === 200) {
            data = (!datakey ? res.data : _.get(res.data, datakey)) || [];
          }
        } catch (err) {}
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
      if (_.isFunction(this.beforeFinish)) {
        await this.beforeFinish();
      }
      const res = download(blob, filename);
      res ? this.$emit('onFinish') : this.$emit('onError');
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
      const field = _.isObject(key) ? key.field : key;
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
      if (!_.isFunction(callback)) return this.defaultValue;
      const value = callback(item);
      return this.parseValue(value);
    },
    parseValue(value) {
      return value || value === 0 || _.isBoolean(value) ? value : this.defaultValue;
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
    const { $props, $listeners, $attrs, $slots } = this;
    const wrapProps = {
      key: this.idName,
      props: {
        ...$props
      },
      attrs: {
        id: this.idName,
        ...$attrs,
        icon: 'el-icon-download'
      },
      on: {
        click: this.generate
      }
    };
    return <el-button {...wrapProps}>{$slots['default']}</el-button>;
  }
};
</script>

<style lang="less" scoped></style>
