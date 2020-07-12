/*
 * @Author: 焦质晔
 * @Date: 2020-03-23 12:51:24
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-12 15:49:10
 */
import { isUndefined } from 'lodash';

const keyboardMixin = {
  methods: {
    keyboardEvent(ev) {
      if (!this.editableColumns.length) return;
      // 至少一个单元格获得焦点
      if (!this.clicked.length) return;
      const { keyCode } = ev;
      // Tab
      if (keyCode === 9) {
        ev.preventDefault();
        const total = this.editableColumns.length;
        let index = this.editableColumns.findIndex(x => x.dataIndex === this.clicked[1]);
        let yIndex = ++index % total;
        const dataIndex = this.editableColumns[yIndex].dataIndex;
        this.setClickedValues([this.clicked[0], dataIndex]);
        this.scrollXToColumn(dataIndex);
      }
      // 左  右
      // if (keyCode === 37 || keyCode === 39) {
      //   ev.preventDefault();
      //   const total = this.editableColumns.length;
      //   let index = this.editableColumns.findIndex(x => x.dataIndex === this.clicked[1]);
      //   let yIndex = keyCode === 37 ? (--index + total) % total : ++index % total;
      //   const dataIndex = this.editableColumns[yIndex].dataIndex;
      //   this.setClickedValues([this.clicked[0], dataIndex]);
      //   this.scrollXToColumn(dataIndex);
      // }
      // 上  下
      if (keyCode === 38 || keyCode === 40) {
        ev.preventDefault();
        const { allRowKeys } = this.$$table;
        const total = allRowKeys.length;
        let index = allRowKeys.findIndex(x => x === this.clicked[0]);
        let xIndex = keyCode === 38 ? (--index + total) % total : ++index % total;
        const rowKey = allRowKeys[xIndex];
        this.setClickedValues([rowKey, this.clicked[1]]);
        this.scrollYToRecord(rowKey, xIndex);
      }
      // Esc
      if (keyCode === 27) {
        this.setClickedValues([]);
      }
    },
    scrollXToColumn(dataIndex, index) {
      const { leftFixedColumns } = this.$$table;
      const v = isUndefined(index) ? this.flattenColumns.findIndex(x => x.dataIndex === dataIndex) : index;
      if (v < 0) return;
      const fixedWidth = leftFixedColumns.map(x => x.width || x.renderWidth || config.defaultColumnWidth).reduce((prev, curr) => prev + curr, 0);
      this.$el.scrollLeft = this.$vTableBody.querySelectorAll('tbody > tr > td')[v].offsetLeft - fixedWidth;
    },
    scrollYToRecord(rowKey, index) {
      const { scrollYStore, allRowKeys } = this.$$table;
      const v = isUndefined(index) ? allRowKeys.findIndex(x => x === rowKey) : index;
      if (v < 0) return;
      this.$el.scrollTop = v * scrollYStore.rowHeight;
    }
  }
};

export default keyboardMixin;
