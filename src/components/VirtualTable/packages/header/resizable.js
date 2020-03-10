/*
 * @Author: 焦质晔
 * @Date: 2020-03-07 19:04:14
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-10 14:02:00
 */
import { getOffsetPos, deepFindColumn } from '../utils';

export default {
  name: 'Resizable',
  props: ['column'],
  inject: ['$$table'],
  methods: {
    resizeMousedown(ev) {
      ev.preventDefault();
      const dom = ev.target;
      const { $vTable, $refs, flattenColumns, defaultColumnWidth, doLayout } = this.$$table;
      const $tableBody = $refs[`tableBody`].$el;
      const target = $refs[`resizable-bar`];

      const half = dom.offsetWidth / 2;
      const disX = ev.clientX;
      const left = getOffsetPos(dom, $vTable).left - $tableBody.scrollLeft + half;

      $vTable.classList.add('c--resize');
      target.style.left = `${left}px`;
      target.style.display = 'block';

      // 操作表格列 -> 违背了单向数据流原则，后期建议优化
      const tColumn = deepFindColumn(flattenColumns, this.column.dataIndex);
      const renderWidth = tColumn.width || tColumn.renderWidth;

      document.onmousemove = function(ev) {
        let ml = ev.clientX - disX;
        let rw = renderWidth + ml;

        // 左边界限定
        if (rw < defaultColumnWidth) return;

        tColumn.width = tColumn.renderWidth = rw;
        target.style.left = `${ml + left}px`;
      };

      document.onmouseup = function() {
        $vTable.classList.remove('c--resize');
        target.style.display = 'none';
        doLayout();
        this.onmousemove = null;
        this.onmouseup = null;
      };

      return false;
    }
  },
  render() {
    const { resizable, bordered } = this.$$table;
    const resizableCls = [
      `v-resizable`,
      {
        [`is--line`]: resizable && !bordered
      }
    ];
    return <div class={resizableCls} onMousedown={this.resizeMousedown} />;
  }
};
