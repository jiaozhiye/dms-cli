/*
 * @Author: 焦质晔
 * @Date: 2020-03-01 15:20:02
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-31 00:29:55
 */
import { throttle, browse, difference, getCellValue, setCellValue } from '../utils';
import config from '../config';
import _ from 'lodash';

const $browse = browse();
const isWebkit = $browse['webkit'];
const throttleScrollYDuration = $browse['msie'] ? 20 : 10;

export default {
  // 创建表格数据
  createTableData(list) {
    const results = list.map((record, index) => {
      record.index = index;
      // 初始化数据
      this.flattenColumns.forEach(column => {
        const { dataIndex, precision } = column;
        if (['__expandable__', '__selection__', config.operationColumn].includes(dataIndex)) return;
        const cellVal = getCellValue(record, dataIndex);
        if (precision >= 0 && !isNaN(Number(cellVal))) {
          setCellValue(record, dataIndex, Number(cellVal).toFixed(precision));
        }
      });
      return record;
    });
    // 设置表格数据
    this.tableFullData = [...results];
    this.tableOriginData = [...results];
    // 设置展开行
    this.rowExpandedKeys = this.createRowExpandedKeys();
  },
  // ajax 获取数据
  async getTableData() {
    const { fetch, fetchParams } = this;
    if (!fetch || fetch.xhrAbort) return;
    // console.log(`ajax 请求参数：`, fetchParams);
    if (process.env.MOCK_DATA === 'true') {
      const { data } = _.cloneDeep(require('@/mock/tableData').default);
      // 模拟分页
      const { currentPage, pageSize } = fetchParams;
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      // 处理数据
      this.createTableData(data.items.slice(start, end));
      this.setRecordsTotal(data.total);
    } else {
      let list = [];
      let total = 0;
      this.showLoading = true;
      try {
        const res = await fetch.api(fetchParams);
        if (res.resultCode === 200) {
          const datakey = fetch.dataKey || config.dataKey;
          list = _.get(res.data, datakey) || [];
          total = _.get(res.data, datakey.replace(/[^\.]+$/, config.totalKey)) || list.length || 0;
        }
        // 服务端合计
        if (this.showFooter) {
          this.flattenColumns
            .filter(x => x.summation && x.summation.dataIndex)
            .forEach(x => {
              this.summaries[x.dataIndex] = Number(res.data[x.summation.dataIndex]) || 0;
            });
        }
      } catch (e) {}
      this.showLoading = false;
      // 处理数据
      this.createTableData(list);
      this.setRecordsTotal(total);
    }
  },
  // 加载表格数据
  loadTableData() {
    const { height, maxHeight, ellipsis, scrollYStore, tableFullData } = this;
    // 是否开启虚拟滚动
    this.scrollYLoad = tableFullData.length > config.virtualScrollY;

    if (this.__dataChange__) {
      if (this.scrollYLoad) {
        scrollYStore.startIndex = 0;
        scrollYStore.visibleIndex = 0;
      }
      this.updateScrollYSpace('reset');
    }

    if (this.scrollYLoad) {
      if (!(height || maxHeight)) {
        console.error('[Table]: 必须设置组件参数 `height` 或 `maxHeight`');
      }
      if (!ellipsis) {
        console.error('[Table]: 必须设置组件参数 `ellipsis`');
      }
    }

    this.handleTableData();
    !this.fetch && this.setRecordsTotal();

    return this.computeScrollLoad();
  },
  // 处理渲染数据
  handleTableData() {
    const { scrollYLoad, scrollYStore, tableFullData } = this;
    // 处理显示数据
    this.tableData = scrollYLoad ? tableFullData.slice(scrollYStore.startIndex, scrollYStore.startIndex + scrollYStore.renderSize) : tableFullData;
  },
  // 设置数据总数
  setRecordsTotal(total) {
    this.total = typeof total === 'undefined' ? this.tableFullData.length : total;
  },
  // 纵向 Y 可视渲染事件处理
  triggerScrollYEvent(ev) {
    // webkit 浏览器使用最佳的渲染方式
    if (isWebkit) {
      this.loadScrollYData(ev);
    } else {
      throttle(this.loadScrollYData, throttleScrollYDuration)(ev);
    }
  },
  // 纵向 Y 可视渲染处理
  loadScrollYData(ev) {
    const { tableFullData, scrollYStore } = this;
    const { startIndex, renderSize, offsetSize, visibleSize, rowHeight } = scrollYStore;
    const scrollTop = ev.target.scrollTop;
    const toVisibleIndex = Math.ceil(scrollTop / rowHeight);
    let preload = false;

    if (scrollYStore.visibleIndex !== toVisibleIndex) {
      const marginSize = Math.min(Math.floor((renderSize - visibleSize) / 2), visibleSize);

      if (scrollYStore.visibleIndex > toVisibleIndex) {
        // 向上
        preload = toVisibleIndex - offsetSize <= startIndex;
        if (preload) {
          scrollYStore.startIndex = Math.max(0, toVisibleIndex - Math.max(marginSize, renderSize - visibleSize));
        }
      } else {
        // 向下
        preload = toVisibleIndex + visibleSize + offsetSize >= startIndex + renderSize;
        if (preload) {
          scrollYStore.startIndex = Math.max(0, Math.min(tableFullData.length - renderSize, toVisibleIndex - marginSize));
        }
      }

      if (preload) {
        this.updateScrollYData();
      }

      scrollYStore.visibleIndex = toVisibleIndex;
    }
  },
  // 更新纵向 Y 可视渲染上下剩余空间大小
  updateScrollYSpace(type) {
    const { scrollYStore, tableFullData, $$tableBody } = this;
    const $tableBody = $$tableBody.$el.querySelector('.v-table--body');
    const $tableYSpaceElem = $$tableBody.$el.querySelector('.v-body--y-space');

    // 重置 dom
    if (type === 'reset') {
      $tableBody.style.transform = '';
      $tableYSpaceElem.style.height = '';
      $tableBody.parentNode.scrollTop = 0;
      return;
    }

    // 计算高度
    const bodyHeight = tableFullData.length * scrollYStore.rowHeight;
    const topSpaceHeight = Math.max(scrollYStore.startIndex * scrollYStore.rowHeight, 0);

    $tableBody.style.transform = `translateY(${topSpaceHeight}px)`;
    $tableYSpaceElem.style.height = `${bodyHeight}px`;
  },
  // 更新 Y 方向数据
  updateScrollYData() {
    this.handleTableData();
    this.updateScrollYSpace();
  },
  // 计算可视渲染相关数据
  async computeScrollLoad() {
    const { scrollYLoad, scrollYStore, layout } = this;
    return this.$nextTick().then(() => {
      if (scrollYLoad) {
        const visibleYSize = Number(Math.ceil(layout.viewportHeight / scrollYStore.rowHeight));

        // 设置 scrollYStore 初始值
        scrollYStore.visibleSize = visibleYSize;
        scrollYStore.offsetSize = visibleYSize;
        scrollYStore.renderSize = isWebkit ? visibleYSize + 3 : visibleYSize + 5;

        // 更新数据
        this.updateScrollYData();
      }
    });
  },
  // 数据变化事件
  dataChangeHandle() {
    this.$emit('dataChange', this.tableFullData);
  },
  // 分页事件
  pagerChangeHandle({ currentPage, pageSize }) {
    this.pagination.currentPage = currentPage;
    this.pagination.pageSize = pageSize;
  },
  // 清空列选中
  clearRowSelection() {
    this.selectionKeys = [];
  },
  // 清空表头排序
  clearTableSorter() {
    this.$$tableHeader.clearTheadSorter();
  },
  // 清空表头筛选
  clearTableFilter() {
    this.$$tableHeader.clearTheadFilter();
  },
  // 是否仅有分页参数产生变化
  onlyPaginationChange(next, prev) {
    const diff = Object.keys(difference(next, prev));
    return diff.length === 1 && (diff.includes('currentPage') || diff.includes('pageSize'));
  }
};
