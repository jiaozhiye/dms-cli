/*
 * @Author: 焦质晔
 * @Date: 2020-03-07 19:04:14
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-07 17:18:37
 */
import { getNodeOffset, deepFindColumn } from '../utils';
import config from '../config';

export default {
  name: 'Resizable',
  props: ['column'],
  inject: ['$$table'],
  computed: {
    $resizableBar() {
      return this.$$table.$refs[`resizable-bar`];
    }
  },
  methods: {
    resizeMousedown(ev) {
      ev.stopPropagation();
      ev.preventDefault();

      const dom = ev.target;
      const { $vTable, $$tableBody, columns, flattenColumns, doLayout, setLocalColumns } = this.$$table;
      const target = this.$resizableBar;

      const half = dom.offsetWidth / 2;
      const disX = ev.clientX;
      const left = getNodeOffset(dom, $vTable).left - $$tableBody.$el.scrollLeft + half;

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
        if (rw < config.defaultColumnWidth) return;

        tColumn.width = tColumn.renderWidth = rw;
        target.style.left = `${ml + left}px`;
      };

      document.onmouseup = function() {
        $vTable.classList.remove('c--resize');
        target.style.display = 'none';
        doLayout();
        setLocalColumns(columns);
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
    return <div class={resizableCls} onMousedown={this.resizeMousedown} onClick={ev => ev.stopPropagation()} />;
  }
};
